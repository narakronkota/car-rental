import React from 'react'
import Title from './Title'
import { assets, dummyCarData} from '../assets/assets.js'
import CarCard from './CarCard'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext';
const FeaturedSection = () => {

    const navigate = useNavigate()

    const { cars } = useAppContext();

  return (
    <div className='flex flex-col items-center  py-24 px-6 md:px-16 lg:px-24 xl:px-1'>
        <div>
            <Title  title='Deatured Vehicles' subtiitle='Explore our section of premium vechicles availblr for you next adventure'></Title>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols2 lg:grid-cols-3 gap-8 mt-18'>
            {/* แก้ไข: เพิ่มการตรวจสอบว่า 'cars' มีค่าและเป็น array ก่อนที่จะ slice */}
                {cars && cars.length > 0 ? (
                    cars.slice(0,3).map((car) => (
                        <div key={car._id}>
                            <CarCard car={car} />
                        </div>
                    ))
                ) : (
                    // แสดงข้อความ loading หรือไม่มีรถให้เห็นขณะรอข้อมูล
                    <p>Loading cars...</p>
                )}

        </div>
        <button onClick={()=>{
           navigate('/cars'); scrollTo(0,0) 
        }} className='flex items-center jusify-center gap-2 px-6 py-2 border border-borderColor hover:bg-gray-50 rounded-md mt-18 cursor-pointer'>
            EXPOLE ALL <img src={assets.arrow_icon} alt="arrow" />

        </button>

    </div>
  )
}

export default FeaturedSection