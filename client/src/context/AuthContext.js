import {createContext} from 'react'

function nothing(){}
export const AuthContext = createContext({
  token: null,
  userId: null,
  login: nothing,
  logout: nothing,
  isAuthenticated: false
})