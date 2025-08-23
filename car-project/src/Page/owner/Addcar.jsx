import React, { useState } from 'react'
import Title from '../../Components/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'


const Addcar = () => {

    const {axios,currency} = useAppContext()


    
    const [image, setImage] =useState(null)
    const [car, setCar] = useState({
        brand : '',
        model: '',
        year: 0,
        pricePerDay: 0,
        category:'',
        transmission: '',
        fuel_type:'',
        seating_capacity: 0,
        location: '',
        description:'',
    });
    
    const [isLoading, setIsLoading] = useState(false)
    const onsubmitHandler = async (e) => {
  e.preventDefault();
  if (isLoading) return null;

  setIsLoading(true);
  try {
    const formData = new FormData();
    formData.append("image", image); // ✅ ต้องชื่อ image ให้ตรงกับ backend
    formData.append("carData", JSON.stringify(car)); // ✅ ต้องเป็น JSON string

    const { data } = await axios.post("/api/owner/add-car", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // ส่ง token ด้วย
      },
    });

    if (data.success) {
      toast.success(data.message);
      setImage(null);
      setCar({
        brand: "",
        model: "",
        year: 0,
        pricePerDay: 0,
        category: "",
        transmission: "",
        fuel_type: "",
        seating_capacity: 0,
        location: "",
        description: "",
      });
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  } finally {
    setIsLoading(false);
  }
};



         

    
  return (
    <div className='px-4 py-10 md:px-10 flex-1'>
         <Title title='Add new car' subtiitle='fill in details to list a new car for booking including pricing  ' align='left '/>

         <form onSubmit={onsubmitHandler} className='flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl'>
            {/***Car image */}
            <div className='flex items-center gap-2 w-full'>
                <label htmlFor="car-image">
                    <img src={image ? URL.createObjectURL(image) : assets.upload_icon} alt="" className='h-14 rounded cursor-pointer' />
                    <input type="file" id='car-image' accept="image/*" hidden onChange={e=>setImage(e.target.files[0])}/>
                </label>
                <p className='text-sm text-gray-500'>Upload a picture of your car </p>
            </div>


            {/****car brand  */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='flex flex-col w-full'>
                    <label>Barnd</label>
                    <input type="text" placeholder="e.g. BMW,Mercedes, Audi..." required  className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.brand} onChange={e=> setCar({...car,brand: e.target.value})}/>
                </div>
                <div className='flex flex-col w-full'>
                    <label>Model</label>
                    <input type="text" placeholder="e.g. BMW,Mercedes, Audi..." required  className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.model} onChange={e=> setCar({...car,model: e.target.value})}/>
                </div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                <div className='flex flex-col w-full'>
                    <label>Year</label>
                    <input type="number" placeholder="2025" required  className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.year} onChange={e=> setCar({...car,year: e.target.value})}/>
                </div>
                <div className='flex flex-col w-full'>
                    <label>Daliy price ({currency})</label>
                    <input type="number" placeholder="202" required  className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.pricePerDay} onChange={e=> setCar({...car,pricePerDay: e.target.value})}/>
                </div>
             
                <div className='flex flex-col w-full'>
                    <label>Category</label>
                    <select onChange={e=> setCar({...car,category: e.target.value})} value={car.category} className='px-3 py-2 mt-1 border border-boderColor'>
                        <option value="">Select a category</option>
                        <option value="Sedan">Sedan</option>
                        <option value="SUV">SUV</option>
                        <option value="Van">Van</option>
                    </select>

                </div>
              </div>

              {/*****ca tranmision */}

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='flex flex-col w-full'>
                          <label>Tranmisson</label>
                    <select onChange={e=> setCar({...car,transmission: e.target.value})} value={car.transmission} className='px-3 py-2 mt-1 border border-boderColor'>
                        <option value="">Select a tranmisson</option>
                        <option value="Sedan">Automatic </option>
                        <option value="SUV">Manual</option>
                        <option value="Van">Semi-Automic</option>
                    </select>

                    </div>
                    <div className='flex flex-col w-full'>
                     <label>Fuel Type</label>
                    <select onChange={e=> setCar({...car,fuel_type: e.target.value})} value={car.fuel_type} className='px-3 py-2 mt-1 border border-boderColor'>
                        <option value="">Select a fuel type</option>
                        <option value="Sedan">Gas </option>
                        <option value="SUV">Diesel</option>
                        <option value="Van">Petrol </option>
                         <option value="Van">Electronic </option>
                          <option value="Van">Hybrid </option>
                    </select>


                    </div>
                    <div className='flex flex-col w-full'>
                        <label>Seaating Capacity </label>
                    <input type="number" placeholder="4" required  className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.seating_capacity} onChange={e=> setCar({...car,seating_capacity: e.target.value})}/>

                    </div>
                  
                </div>
                {/*** car loacation */}
                <div className='flex flex-col w-full'>

                      <label>Location</label>
                    <select onChange={e=> setCar({...car,location: e.target.value})} value={car.location} className='px-3 py-2 mt-1 border border-boderColor rounded-md outline-none'>
                        <option value="">Select a location </option>
                        <option value="New york">New york  </option>
                        <option value="LOS anagless">LOS anagless</option>
                        <option value="Houston">Houston </option>
                         <option value="Chicago">Chicago  </option>
                          <option value="Hybrid">Hybrid </option>
                    </select>
                </div>
                <div>
                     <div className='flex flex-col w-full'>
                    <label>Description </label>
                    <textarea type="number" placeholder="luxury Suv WITH A spacious interor" required  className='px-3 py-6 mt-1 border border-borderColor rounded-md outline-none' value={car.description} onChange={e=> setCar({...car,description: e.target.value})}></textarea>
                </div>
                </div>
                <button className='flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-meddium w-max cursor-pointer'>
                    <img src={assets.tick_icon} alt="" />
                       {isLoading ? 'Listing...' :  'List our Car' }
                    </button>
            

         </form>
    </div>
  )
}

export default Addcar