import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {useMessage} from "../hooks/message.hook"
import {AuthContext} from '../context/AuthContext'
import {useHttp} from "../hooks/http.hook"

export const AccountScreen = () => {
  const {request} = useHttp()

  const {header, container, page, wrapper, listItemStyle} = style
  const history = useHistory()
  const auth = useContext(AuthContext)
  const {token} = useContext(AuthContext)


  const [inputValue, setInputValue] = useState('')
  const [list, setList] = useState([])


  const getList = useCallback(async () => {
    try {
      const data = await request(
        '/api/task',
        'GET',
        null,
        {Authorization: `Bearer ${token}`}
      )
      setList([...data])
    } catch (e) {

    }
  }, [token, request, setList])


  useEffect(() => {
    getList()
  }, [getList])


  const logoutHandler = event => {
    event.preventDefault()
    auth.logout()
    history.push('/')
  }

  const message = useMessage()

  const importantButtonHandler = () => {
    message("This button doesn't do anything. Like you right now")
  }


  const keyPressed = async (event) => {
    if (event.key === 'Enter') {
      if (inputValue) {
        const text = inputValue
        event.target.value = ''
        try {
          const data = await request(
            '/api/task/add',
            'POST',
            {text: text},
            {Authorization: `Bearer ${auth.token}`}
          )
          setList([...list, data.task])
        } catch (e) {
        }
      }
    }
  }


  const listItemClickHandler = event => {
    event.preventDefault()
  }
  const listItemDeleteHandler = async (event, id) => {
    event.preventDefault()
    try {
      // console.log(id)
      // const id = await event.target.parentElement.getAttribute('name')
      const data = await request(
        '/api/task/delete',
        'POST',
        {_id: id},
        {Authorization: `Bearer ${auth.token}`}
      )
      if (data.message == 'success') {
        getList()
      }
      // console.log(data)

    } catch (e) {
    }


  }

  const onChangeHandler = (event) => {
    setInputValue(event.target.value)
  }


  return (
    <div style={page}>
      <div style={wrapper}>
        <div style={header}>
          <h3 style={{margin: 0}}>
            justdoit
          </h3>

          <a className="waves-effect waves-light btn"
             href="/"
             onClick={logoutHandler}
          >Logout</a>
        </div>
        <div style={container}>

          <input type="text" name="inputTodo" autoFocus={true}
                 onChange={onChangeHandler} onKeyPress={keyPressed}
                 placeholder="you have 24h to do it"
                 style={{textAlign: 'center'}}/>


          <a onClick={importantButtonHandler} className="waves-effect waves-light btn red">
            very important button
          </a>
          <div className={"collection"} style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
            {
              [...list].reverse().map((item, index) => {
                return (
                  <div name={item._id} style={listItemStyle} key={index}>
                    <a onClick={listItemClickHandler} className={"collection-item"}
                       style={{flex: 1}}>{item.text}</a>
                    <a onClick={e => {
                      listItemDeleteHandler(e, item._id)
                    }}
                       className={"collection-item"}>
                      <i className="small material-icons">delete</i>
                    </a>

                  </div>
                )
              })
            }
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
      flexDirection: 'column',
      margin: 'auto',
      maxWidth: 800,

    },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  header: {
    display: "flex",
    flex: 0.1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    backgroundColor: '#424242',
    color: 'white'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
    boxShadow: '0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(0,0,0,0)'
  },
  inputBlock: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 10,
  },

  listItemStyle: {
    display: 'flex',

  }
}