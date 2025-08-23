import React from 'react'
import { assets,  } from '../../assets/assets'
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const Navbarowner = () => {

    const {user} = useAppContext()
  return (
    <div className='flex items-center justify-between px-6 md:px-10 py-4 text-gray-500 border-b border-boderColor relative transition-all'>
        <Link to={'/'}>
         <Link to="/" className="flex items-center gap-2">
            
               <span className="font-medium text-2xl text-gray-800">CAR RENTAL </span>
             </Link>
       
        </Link>
        <p className='text-lg'>Welcome , {user.name || "Owner"}</p>

    </div>
  )
}

export default Navbarowner