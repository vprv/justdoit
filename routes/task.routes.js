const {Router} = require('express')
const Task = require('../models/Task')
const auth = require('../middleware/auth.middleware')
const router = Router()

//Add task
router.post('/add', auth, async (req, res) => {
  try {
    const {text} = req.body

    const task = new Task({
      text, done:false, owner: req.user.userId
    })
    await task.save()
    res.status(201).json({task})

  } catch (e) {
    res.status(500).json({message: 'Login failed. Something went wrong, try again later'})
  }
})

//delete task
router.post('/delete', auth, async (req, res) => {
  try {
    // console.log('vot eto nado udalit', req.body, req.user.userId)
    const {_id} = req.body
    if(_id){
      const task = await Task.findById(_id)
      if(task.owner == req.user.userId){
        await task.delete()
        res.status(201).json({message: 'success'})
      } else {
        res.status(201).json({message: 'error'})
      }
    }
  } catch (e) {
    res.status(500).json({message: 'Login failed. Something went wrong, try again later'})
  }
})






//Get task list
router.get('/', auth,async (req, res) => {
  try {
    const list = await Task.find({owner: req.user.userId})
    res.json(list)
  } catch (e) {
    res.status(500).json({message: 'Login failed. Something went wrong, try again later'})
  }
})

//Get task by id
// router.get('/:id', auth, async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id)
//     res.json(task)
//   } catch (e) {
//     res.status(500).json({message: 'Login failed. Something went wrong, try again later'})
//   }
// })

module.exports = router