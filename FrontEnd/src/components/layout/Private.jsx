import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet ,Navigate} from "react-router-dom"

function Private() {
const IsUserLogin=useSelector(state=>state.User.IsUserLogin)

  return (IsUserLogin?<Outlet/>:<Navigate to={'/'}/>)

  
}

export default Private
