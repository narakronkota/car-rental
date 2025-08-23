import React, { useEffect, useState } from 'react';
import Title from '../Components/Title';
import { assets } from '../assets/assets';
import CarCard from '../Components/CarCard';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { motion } from "framer-motion"; // ✅ เพิ่ม framer-motion

const Cars = () => {
    const [searchParams] = useSearchParams();
    const pickupLocation = searchParams.get('pickupLocation');
    const pickupDate = searchParams.get('pickupDate');
    const returnDate = searchParams.get('returnDate');

    const { cars, axios } = useAppContext();
    const [input, setInput] = useState('');
    const [filteredCars, setFilteredCars] = useState([]);

    const isSearchData = pickupLocation && pickupDate && returnDate;

    const searchCarAvailability = async () => {
        try {
            const payload = { pickupLocation, pickupDate, returnDate };
            const { data } = await axios.post('/api/bookings/check-availability', payload);
            if (data.success) {
                setFilteredCars(data.availableCars);
                if (data.availableCars.length === 0) {
                    toast.success('ไม่มีรถว่างสำหรับช่วงเวลาที่เลือก');
                }
            } else {
                setFilteredCars([]);
                toast.error(data.message || 'Failed to check car availability.');
            }
        } catch (error) {
            console.error('Error fetching car availability:', error);
            setFilteredCars([]);
            toast.error('Failed to fetch car availability. Please try again.');
        }
    };

    useEffect(() => {
        if (isSearchData) {
            searchCarAvailability();
        } else {
            setFilteredCars(cars);
        }
    }, [isSearchData, cars, pickupLocation, pickupDate, returnDate]);

    useEffect(() => {
        if (input.trim() === '') {
            setFilteredCars(cars); 
            return;
        }
        const filtered = cars.filter(car => 
            (car.make?.toLowerCase().includes(input.toLowerCase()) || false) ||
            (car.model?.toLowerCase().includes(input.toLowerCase()) || false) ||
            (car.features?.some(feature => feature?.toLowerCase().includes(input.toLowerCase())) || false)
        );
        setFilteredCars(filtered);
    }, [input, cars]);

    return (
        <div>
            <div className='flex flex-col items-center py-20 bg-light max-md:px-4'>
                <Title 
                  title='Available Cars' 
                  subtitle='Browse our selection of premium vehicles available for your next adventure' 
                />
                <div className='flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow'>
                    <img src={assets.search_icon} alt="" className='w-4.5 h-4 mr-2' />
                    <input
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                        type="text"
                        placeholder='Search by make, model, or features'
                        className='w-full h-full outline-none text-gray-900'
                    />
                    <img src={assets.filter_icon} alt="" className='w-4.5 h-4.5 ml-2' />
                </div>
            </div>

            <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
                <p className='text-gray-500 xl:px-20 max-w-8xl mx-auto'>
                    Showing {filteredCars ? filteredCars.length : 0} Cars
                </p>

                <motion.div 
                  className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto'
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: { 
                      opacity: 8,
                      transition: { staggerChildren: 150 } // ✅ สลับเรียงทีละ item
                    }
                  }}
                >
                    {filteredCars && filteredCars.length > 0 ? (
                        filteredCars.map((car, index) => (
                            <motion.div 
                              key={index}
                              variants={{
                                hidden: { opacity: 0, scale: 0.9, y: 30 },
                                show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4 } }
                              }}
                            >
                                <CarCard car={car} />
                            </motion.div>
                        ))
                    ) : (
                        <motion.div 
                          className="text-center w-full text-gray-500"
                          initial={{ opacity: 5 }}
                          animate={{ opacity: 50 }}
                        >
                            ไม่พบรถที่ตรงตามการค้นหา
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Cars;
