import React, { useEffect, useState } from 'react'
import { data, useNavigate, useParams } from 'react-router-dom'
import { assets,  } from '../assets/assets'
import Loader from '../Components/Loader'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Cardetails = () => {
    const { id } = useParams();
    const { cars, axios } = useAppContext();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [pickupDate, setPickupDate] = useState(''); // สร้าง state สำหรับ pickupDate
    const [returnDate, setReturnDate] = useState(''); // สร้าง state สำหรับ returnDate
    const currency = import.meta.env.VITE_CURRENCY;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ตรวจสอบว่าวันที่ถูกเลือกหรือไม่
        if (!pickupDate || !returnDate) {
            return toast.error("Please select both pickup and return dates.");
        }
        if (new Date(returnDate) < new Date(pickupDate)) {
             return toast.error("Return date cannot be before pickup date.");
        }

        try {
            const { data } = await axios.post('/api/bookings/create', {
                car: id,
                pickupDate,
                returnDate
            });

            if (data.success) {
                toast.success(data.message);
                navigate('/my-bookings');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Booking submission error:", error);
            // ตรวจสอบว่า error มี response และ message หรือไม่
            toast.error(error.response?.data?.message || 'Failed to create booking.');
        }
    };

    useEffect(() => {
        if (cars && cars.length > 0) {
            const foundCar = cars.find(item => item._id === id);
            if (foundCar) {
                setCar(foundCar);
            }
        }
    }, [cars, id]); 
  return car ? (
    <div   className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>
      <button onClick={()=> navigate(-1)} className='flex items-center gap-2 mb-6 text-1xl text-gray-500 cursor-pointer'>
        <img src={assets.arrow_icon} alt="" className='rotate-180 opacity-65 ' />BACK ALL CAR 
      </button>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
     {/***** left car */}
        <div className='lg:col-span-2'>
          <img src={car.image} alt="" className='w-full h-auto md:max- rounded-xl mb-6 shadow-md' />
          <div className='space-y-6'>
            <div>
              <h1 className='text-5xl font-bold'>{car.brand} {car.model}</h1>
              <p className='text-gray-500 text-lg'>{car.category}  {car.year}</p>
            </div>
            <hr  className='border-border-Color my-6'/>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>

                
              
                  <div className='flex flex-col items-center bg-light p-4 rounded-lg'>
                    <img src={assets.users_icon} alt="" className='h-5 mb-2' />
                      <span>{car.seating_capacity} Seats </span>
                    
                  </div>
                  
                  <div className='flex flex-col items-center bg-light p-4 rounded-lg'>
                    <img src={assets.fuel_icon} alt="" className='h-5 mb-2' />
                      <span>{car.fuel_type} fuel </span>
                    
                  </div>
                  
                  <div className='flex flex-col items-center bg-light p-4 rounded-lg'>
                    <img src={assets.car_icon} alt="" className='h-5 mb-2' />
                      <span>{car.tranmission} transmission </span>
                    
                  </div>
                  
                  <div className='flex flex-col items-center bg-light p-4 rounded-lg'>
                    <img src={assets.location_icon} alt="" className='h-5 mb-2' />
                      <span>{car.location_icon} location </span>
                    
                  </div>




       

            </div>
            {/***description */}
              <div>
                <h1 className='text-2xl font-medium mb-3'>Description</h1>
                <p className='text-gray-500'>{car.description}</p>
              </div>
              {/**Features */}
              <div className='grid grid-cols-2 sm :grid-cols-2 gap-2'>
                <h1 className='text-xl font-medium mb-3'>Features</h1>
                <ul className=''></ul>
                {
                  ["360 Camera" , "Blutooth " , "GPS" , "Heated Seats" , "Rear View Mirror" ].map((item)=>(
                    <li key={item} className='flex items-center text-gray-500'>
                      <img src={assets.check_icon} className='h-4 mr-2' alt="" />
                      {item}
                    </li>
                  ))
                }
              </div>
          </div>



        </div>
        {/***** right booking frome */}
            <form onSubmit={handleSubmit} className='shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500'>
                <div className='flex items-center justify-between'>
                    <p className='text-3xl text-gray-800 font-semibold'>{currency}{car.pricePerDay}</p> <span className='text-base text-gray-400 font-normal'>per day </span>
                </div>
                <div>
                    <div className='flex flex-col gap-2 -mt-3'>
                        <label htmlFor="pickup-date">Pickup Date</label>
                        {/* ผูก input กับ state */}
                        <input
                            type="date"
                            className='border border-borderColor px-3 py-2 rounded-lg'
                            required
                            id='pickup-date'
                            min={new Date().toISOString().split('T')[0]}
                            value={pickupDate}
                            onChange={(e) => setPickupDate(e.target.value)}
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="return-date">Return Date</label>
                        {/* ผูก input กับ state */}
                        <input
                            type="date"
                            className='border border-borderColor px-3 py-2 rounded-lg'
                            required
                            id='return-date'
                            min={new Date().toISOString().split('T')[0]} // ควรตั้ง min date
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                        />
                    </div>
                    {/* ... (โค้ดส่วนอื่น ๆ) ... */}
                    <div className='flex flex-col gap-2 mt-5'>
                        <button type="submit" className='w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl cursor-pointer'>
                            Book Now
                        </button>
                    </div>
                </div>
            </form>
      </div>

    </div>
  ) : <Loader/>
}

export default Cardetails

