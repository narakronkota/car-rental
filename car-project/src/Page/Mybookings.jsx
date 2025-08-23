import React, { useEffect, useState } from 'react'
import { assets,  } from '../assets/assets'
import Title from '../Components/Title'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { data } from 'react-router-dom'
const Mybookings = () => {

  const {axios,user,currency } = useAppContext()
  const [booking, setBookings] = useState([])
  

  const fetchOwnerBookings = async () =>{
    try {
      const {data} = await axios.get('/api/bookings/user')
      if(data.success){
        setBookings(data.bookings)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(data.message)
      
    }
  }
  useEffect(()=>{
    user && fetchOwnerBookings()
  },[user])
  return (
    <div className='px-6 md:px-16 ;g:px-24 xl:px32 2xl:px-48 mt-16 text-sm'>
      <Title title='My Bookings' subtiitle='View manage your all car  bookings ' align='left '/>
      <div>
        {booking.map((booking , index)=>(
          <div key={booking._id} className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12'>
            {/**** */}
            <div className='md:col-span-1'>
              <div className='rounded-md overflow-hidden mb-3'>
                <img src={booking.car.image} alt="" className='w-full h-auto aspect-video object-cover' />

              </div>
                <p className='text-lg font-medium mt-2'>{booking.car.brand} {booking.car.model}</p>

                <p className='text-gray-500'>{booking.car.year} {booking.car.category} {booking.car.location}</p>
            </div>
            {/**** info book */}
            <div className='md:col-span-2'>
              <div className='flex items-center gap-2'>
                <p className='px-3 py-1.5 bg-light rounded'>Booking #{index+1 }</p>
                <p className= {`px-3 py-1 text-xs rounded-full ${booking.status ==='confirmed' ? 'bg-green-400/15 text-green-600 ' : 'bg-red-400/15 text-red-600'}`}>{booking.status}</p>

              </div>
              <div className='flex items-start gap-2 mt-3'>
                <img src={assets.calendar_icon_colored} alt="" className='w-4 h-4 mt-1' />
                <div>
                  <p className='text-gray-500 text-1xl'>Rental Period</p>
                  <p>{booking.pickupDate.split('T')[0]} To{booking.returnDate.split('T')[0]}</p>
                </div>
              </div>
              <div className='flex items-start gap-2 mt-3'>
                <img src={assets.location_icon} alt=""  className='w-4 h-4 mt-1'/>
                <div>
                  <p className='text-gray-500'>Pick-up location</p>
                  <p>{booking.car.location}</p>
                 
                </div>

              </div>

            </div>
            {/***price  */}
            <div className='md:col-span-1 flrx flex-col justify-between gap-6'>
              <div>
                <p>Total Price</p>
                <h1 className='text-xl font-semibold text-primary'>{currency} {booking.price}</h1>
                <p>Booked on {booking.createdAt.split('T')[0]}</p>

              </div>

            </div>

          </div>

        ))}
      </div>
       </div>

      
       
 



        
 
  

 
  )
}

export default Mybookings