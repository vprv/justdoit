import React, {useContext, useEffect, useState} from 'react'
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";


export const AuthScreen = () => {
  const auth = useContext(AuthContext)
  const {loading, request, error, clearError} = useHttp()
  const {page, container, button, header, wrapper} = style

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const message = useMessage()

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  const changeHandler = event => {
    setForm({...form, [event.target.name]: event.target.value})
  }

  const registerHandler = async () => {
    try {
      const response = await request('/api/auth/register', 'POST', {...form})
      message(response.message)

      if(response.message == 'User created') {
        const data = await request('/api/auth/login', 'POST', {...form})
        auth.login(data.token, data.userId)
      }

    } catch (e) {
    }
  }

  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', {...form})
      auth.login(data.token, data.userId)
    } catch (e) {
    }
  }


  return (
    <div style={page}>
      <div style={wrapper}>
        <div style={header}>
          <h3 style={{margin: 0}}>justdoit</h3>
        </div>
        <div style={container}>
          <div className={"input-field"}>
            <input type="text"
                   name={'email'}
                   id={'email'}
                   placeholder={'Email'}
                   onChange={changeHandler}
            />
            <input type="password"
                   name={'password'}
                   id={'password'}
                   placeholder={'Password'}
                   onChange={changeHandler}
            />
          </div>
          <div>
            <a className="waves-effect waves-light btn"
               style={button}
               disabled={loading}
               onClick={loginHandler}
            >Login</a>
            <a className="waves-effect waves-light btn red"
               style={button}
               onClick={registerHandler}
               disabled={loading}
            >Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  )
}


const style = {
  page:
    {
      display: 'flex',
      maxWidth: window.innerWidth,
      height: window.innerHeight,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',

    },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 500,

    boxShadow: '0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(0,0,0,0)'
  },
  button: {
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  header: {
    display: "flex",
    flex: 0.1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    backgroundColor: '#424242',
    color: 'white',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    // minWidth: 500,
    maxWidth: 1000,

  }
}

