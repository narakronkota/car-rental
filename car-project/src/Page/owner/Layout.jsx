import React, { useEffect } from 'react'
import Navbarowner from '../../Components/owner/Navbarowner'
import Slidbar from '../../Components/owner/Slidbar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {
  const {isOwner ,navigate} = useAppContext();

  useEffect(()=>{
    if (!isOwner) {
      navigate('/')
      
    }
  })
  return (
    <div className='flex flex-col'>
        <Navbarowner/>
        <div className='flex'>
            <Slidbar/>
            <Outlet/> 
        </div>

    </div>
  )
}

export default Layout