import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

// แก้ไขฟังก์ชันเพื่อตรวจสอบการทับซ้อนของช่วงเวลาได้อย่างถูกต้อง
const checkAvailability = async (car, pickupDate, returnDate) => {
    const bookings = await Booking.find({
        car: car,
        $or: [
            // เงื่อนไขที่ 1: การจองเดิมเริ่มก่อนและสิ้นสุดหลังวันที่ขอ
            {
                pickupDate: { $lte: returnDate },
                returnDate: { $gte: pickupDate },
            },
            // เงื่อนไขที่ 2: การจองเดิมเริ่มและสิ้นสุดอยู่ภายในวันที่ขอ
            {
                pickupDate: { $gte: pickupDate },
                returnDate: { $lte: returnDate },
            },
        ],
    });
    // หากไม่พบการจองที่ทับซ้อนกัน จะคืนค่า true (ว่าง)
    return bookings.length === 0;
};

// API สำหรับตรวจสอบความพร้อมใช้งานของรถ
export const checkAvailabilityofCar = async (req, res) => {
    try {
        const { pickupLocation, pickupDate, returnDate } = req.body;
        
        // Ensure required fields are present
        if (!pickupLocation || !pickupDate || !returnDate) {
            // Return an error response if data is missing
            return res.status(400).json({ success: false, message: "Missing required fields: pickupLocation, pickupDate, or returnDate" });
        }

        // Find cars that match the location and are generally available
        const cars = await Car.find({ location: pickupLocation, isAvailable: true });

        // Use Promise.all to filter for cars available in the specified time frame
        const availableCars = await Promise.all(
            cars.map(async (car) => {
                const isAvailable = await checkAvailability(car._id, pickupDate, returnDate);
                // Return the car object only if it's available
                return isAvailable ? car.toObject() : null;
            })
        ).then(results => results.filter(car => car !== null)); // Filter out null values

        // Respond with the list of available cars
        res.status(200).json({ success: true, availableCars });
    } catch (error) {
        console.error("Error fetching car availability:", error.message);
        // Respond with a 500 status for server errors
        res.status(500).json({ success: false, message: "An error occurred on the server." });
    }
};

// Other API functions
// API สำหรับสร้างการจอง
// bookingController.js

// bookingController.js

export const createBooking = async (req, res) => {
    try {
        const { _id } = req.user;
        const { car, pickupDate, returnDate } = req.body;

        if (!car || !pickupDate || !returnDate) {
            return res.status(400).json({ success: false, message: "Missing required booking information." });
        }
        
        const isCarAvailable = await checkAvailability(car, pickupDate, returnDate);
        
        if (!isCarAvailable) {
            return res.status(400).json({ success: false, message: "รถไม่ว่างมีคนจองเเล้ว." });
        }

        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);
        const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
        
        if (isNaN(noOfDays) || noOfDays <= 0) {
            return res.status(400).json({ success: false, message: "Invalid date range." });
        }

        const carData = await Car.findById(car);
        const price = carData.pricePerDay * noOfDays;

        await Booking.create({ car, owner: carData.owner, user: _id, pickupDate, returnDate, price });

        // ✅ เพิ่มโค้ดส่วนนี้เพื่ออัปเดตสถานะ isAvailable ของรถ
        const updatedCar = await Car.findByIdAndUpdate(car, { isAvailable: false }, { new: true });
        
        if (!updatedCar) {
            // กรณีเกิดข้อผิดพลาดในการอัปเดต
            console.error('Error updating car availability status');
        }

        res.json({ success: true, message: "Booking created" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API สำหรับแสดงรายการการจองของผู้ใช้
export const getUserBookings = async (req, res) => {
    try {
        const { _id } = req.user;
        const bookings = await Booking.find({ user: _id }).populate("car").sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// API สำหรับแสดงรายการการจองของเจ้าของรถ
export const fetchOwnerBookings = async (req, res) => {
    try {
        if (req.user.role !== 'owner') {
            return res.json({ success: false, message: "Unauthorized" });
        }
        // เลือกฟิลด์เฉพาะที่จำเป็นเพื่อความปลอดภัย
        const bookings = await Booking.find({ owner: req.user._id })
            .populate({ path: 'car' })
            .populate({ path: 'user', select: '-password' })
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
// bookingController.js

export const changeBookingStatus = async (req, res) => {
    try {
        const { _id } = req.user;
        const { bookingId, status } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking || booking.owner.toString() !== _id.toString()) {
            return res.status(401).json({ success: false, message: "Unauthorized or booking not found" });
        }
        
        booking.status = status;
        await booking.save();
        
        // 1. ดึงข้อมูลการจองทั้งหมดของเจ้าของรถอีกครั้ง
        const updatedBookings = await Booking.find({ owner: _id })
            .populate({ path: 'car' })
            .populate({ path: 'user', select: '-password' })
            .sort({ createdAt: -1 });

        // 2. ส่งข้อมูลรายการจองล่าสุดกลับไปยัง Frontend พร้อมกับข้อความสำเร็จ
        res.json({ success: true, message: "Status Updated", bookings: updatedBookings });
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};