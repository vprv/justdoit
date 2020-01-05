import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {useMessage} from "../hooks/message.hook"
import {AuthContext} from '../context/AuthContext'
import {useHttp} from "../hooks/http.hook"

import M from 'materialize-css'

export const AccountScreen = () => {

  const autoInit = async () => {
    await M.AutoInit()
  }

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
      autoInit()
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
        setInputValue('')
        try {
          const data = await request(
            '/api/task/add',
            'POST',
            {text: text},
            {Authorization: `Bearer ${auth.token}`}
          )


          setList([...list, data.task])
          autoInit()


        } catch (e) {
        }
      }
    }
  }


  const listItemClickHandler = event => {
    event.preventDefault()
  }

  const makeDoneHandler = async (event, id) => {
    event.preventDefault()

    try {
      const data = await request(
        '/api/task/done',
        'POST',
        {_id: id},
        {Authorization: `Bearer ${auth.token}`}
      )
      if (data.message == 'success') {
        getList()
      }
    } catch (e) {
    }

  }

  const listItemDeleteHandler = async (event, id) => {
    event.preventDefault()
    try {
      const data = await request(
        '/api/task/delete',
        'POST',
        {_id: id},
        {Authorization: `Bearer ${auth.token}`}
      )
      if (data.message == 'success') {
        getList()
      }

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
                 placeholder="just do it"
                 style={{textAlign: 'center'}}/>


          <a onClick={importantButtonHandler} className="waves-effect waves-light btn red">
            very important button
          </a>
          <div className={"collection"} style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
            {
              [...list].reverse().map((item, index) => {
                return (
                  <div name={item._id} style={listItemStyle} key={index}>


                    <a onClick={(e) => {
                      e.preventDefault()
                    }}
                       className={`collection-item modal-trigger ${item.done ? 'active' : ''}`}
                       data-target={!item.done ? `modal${index}` : null}
                       style={{flex: 1}}>{item.text}</a>


                    {!item.done ? <a onClick={e => {
                        listItemDeleteHandler(e, item._id)
                      }}
                                     className={"collection-item"}>
                        <i className="small material-icons">delete</i>
                      </a>
                      : null
                    }


                    <div id={`modal${index}`} className="modal">
                      <div className="modal-content">
                        <h4>{item.text}</h4>
                        <p>Are you really have done it? You will not able to cancel it.</p>
                      </div>
                      <div className="modal-footer">
                        <a onClick={e => {
                          makeDoneHandler(e, item._id)
                        }} className="modal-close waves-effect waves-green btn-flat">Agree</a>
                      </div>
                    </div>


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
    cursor: 'pointer'

  }
}