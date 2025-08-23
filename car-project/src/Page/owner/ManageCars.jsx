import React, { useEffect, useState } from 'react'
import { assets, dummyCarData } from '../../assets/assets'
import Title from '../../Components/Title'
import axios from 'axios'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageCars = () => {
const {isOwner,axios,currency} = useAppContext()

const [car, setCar] = useState([])

  


const fetOwnerCars = async () => {
  try {
    const { data } = await axios.get('/api/owner/cars'); // ✅ เปลี่ยนเป็น GET
    if (data.success) {
      setCar(data.cars);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};

const toggleCarAcailability = async (carId) => {
  try {
    const { data } = await axios.post('/api/owner/toggle-car',{carId}) // ✅ เปลี่ยนเป็น GET
    if (data.success) {
      toast.success(data.message)
      fetOwnerCars()
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};

const DeleteCar = async (carId) => {
  try {
    const { data } = await axios.post('/api/owner/delete-car', { carId });
    if (data.success) {
      setCar(prev => prev.filter(c => c._id !== carId));
      toast.success("Car deleted");
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};

useEffect(()=>{
  isOwner && fetOwnerCars()
},[isOwner])

  return (
      <div className='px-4 py-10 md:px-10 w-full'>
          <Title title='Manage Cars' subtiitle='fill in details to list a new car for booking including pricing  ' align='left '/>
          <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
            <table className='w-full border-collapse text-left text-sm text-gray-600'>
              <thead className='text-gray-500'>
                <tr>
                  <th className='p-3 font-medium'>Cars</th>
                  <th className='p-3 font-medium'>Category</th>
                  <th className='p-3 font-medium'>Price </th>
                  <th className='p-3 font-medium'>Status</th>
                  <th className='p-3 font-medium'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {car.map((car, index)=>(
                  <tr key={index} className='border-t border-borderColor'>
                    <td className='p-3 flex items-center gap-3'>
                      <img src={car.image} alt="" className='h-12 w-12 aspect-square rounded-md object-cover' />
                      <div className='max-md:hidden'>
                        <p className='font-medium'>{car.brand} {car.model}</p>
                        <p className='textxs text-gray-500'>{car.seating_capacity } {car.transmission}</p>
                      </div>

                    </td>
                    <td className='p-3 max-md:hidden'> {car.category }</td>
                       <td className='p-3 '> {car.PricePerDay } / day </td>
                        <td className='p-3 max-md:hidden'>
                          <span className={`px-3 py-1 rounded-full text-xs ${car.isAvaliable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                            {car.isAvaliable ? "Available" : "Unvaailable"}

                          </span>
                        </td>
                        <td className='flex items-center p-3'>

                          <img  onClick={()=>toggleCarAcailability(car._id)} src={car.isAvaliable ? assets.eye_close_icon : assets.eye_icon} alt="" className='cursor-pointer' />
                          <img onClick={()=> DeleteCar(car._id)} src={assets.delete_icon} alt="" className='cursor-pointer' />

                        </td>
                       
                     
                    

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
      </div>
       
  )
}

export default ManageCars