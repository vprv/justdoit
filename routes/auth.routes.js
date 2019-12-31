const {Router} = require('express')
const router = Router()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')

const User = require('../models/User')
const config = require('config')


// /api/auth/register
router.post(
  '/register',
  [
  check('email', 'Bad email').isEmail(),
  check('password', 'min password length')
  .isLength({min: 6})
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Bad email or password'
        })
      }

      const {email, password} = req.body
      const candidate = await User.findOne({email})

      if (candidate) {
        res.status(400).json({message: "User exist"})
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({email, password: hashedPassword})
      await user.save()
      res.status(201).json({message: 'User created'})

    } catch (e) {
      res.status(500).json({message: 'Registration failed. Something went wrong, try again later'})
    }
  })

// /api/auth/login
router.post(
  '/login',
  [
  check('email', 'Wrong email').normalizeEmail().isEmail(),
  check('password', 'Wrong password').exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Login failure. Bad email or password'
        })
      }
      const {email, password} = req.body
      const user = await User.findOne({email})
      if (!user) {
        return res.status(400).json({message: "User not found"})
      }
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(400).json({message: 'Wrong password'})
      }

      const token = jwt.sign(
        {userId: user.id},
        config.get('jwtSecret'),
        {expiresIn: '1h'}
        )
      res.json({token, userId: user.id})


    } catch (e) {
      res.status(500).json({message: 'Login failed. Something went wrong, try again later'})
    }
  })


module.exports = router