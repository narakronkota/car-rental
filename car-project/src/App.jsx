import React, { useState } from 'react'
import Navbar from './Components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './Page/Home'
import Cardetails from './Page/Cardetails'

import Mybookings from './Page/Mybookings'
import Cars from './Page/Cars'
import Layout from './Page/owner/Layout'
import Dashboard from './Page/owner/Dashboard'
import Addcar from './Page/owner/Addcar'
import ManageCars from './Page/owner/ManageCars'
import ManageBookings from './Page/owner/ManageBookings'
import Login from './Components/Login'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'


const App = () => {

  const {showLogin} = useAppContext()
  const isOwnerPath = useLocation().pathname.startsWith('/owner')
  return (
   <div>
    <Toaster/>
    {showLogin && <Login/>}
    
   
    {!isOwnerPath && <Navbar/>}

    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/car-details/:id' element={<Cardetails/>}/>
      <Route path='/cars' element={<Cars/>}/>
      <Route path='/my-bookings' element={<Mybookings/>}/>
      <Route path='/owner' element={<Layout/>}>
        <Route index element={<Dashboard/>}/>
        <Route path='add-car' element={<Addcar/>}/>
        <Route path='manage-cars' element={<ManageCars/>}/>
        <Route path='manage-bookings' element={<ManageBookings/>}/>

      </Route>
    </Routes>

   </div>
   
  )
}

export default App