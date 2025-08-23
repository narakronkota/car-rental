
import imagekit from "../configs/imageKit.js";
import User from "../models/User.js";
import fs from "fs";
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";


 export const changeRoleToOwner = async (req, res) => {
  try {
         const { _id } = req.user;
         // ใช้ findByIdAndUpdate เพื่อเปลี่ยน role
         await User.findByIdAndUpdate(_id, { role: "owner" });
        res.json({ success: true, message: "ตอนนี้คุณสามารถลงประกาศรถได้แล้ว" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });     }
 };

///AD CAR to list car 

export const addCar = async (req, res) => {
  try {
    // ✅ Debug log เพื่อดูว่ามีข้อมูลอะไรมา
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);

    const { _id } = req.user;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "Image file is required"
      });
    }

    let car;
    try {
      car = JSON.parse(req.body.carData);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid car data format"
      });
    }

    // อ่านไฟล์จาก path
    const fileBuffer = fs.readFileSync(imageFile.path);

    // อัปโหลดไป imagekit
    const uploadResponse = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/cars"
    });

    const optimizedImageURL = imagekit.url({
      path: uploadResponse.filePath,
      urlEndpoint: "https://ik.imagekit.io/9bzazrd0b",
      transformation: [
        { width: "1280" },
        { quality: "auto" },
        { format: "webp" }
      ]
    });

    // สร้างข้อมูลรถใน DB
    await Car.create({ ...car, owner: _id, image: optimizedImageURL });

    res.json({ success: true, message: "Car Added" });
  } catch (error) {
    console.error("AddCar Error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};
//api to list owner Cars export
export const getOwnerCars = async (req, res)=>{
    try {
        const{_id} = req.user;
        const cars = await Car.find({owner: _id})
        res.json({success : true , cars})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

//api to toggle car
export const toggleCarAcailability = async (req, res) =>{
    try {
        const {_id} = req.user;
        const {carId} = req.body
        const car = await Car.findById(carId)

        if (car.owner.toString() !== _id.toString()){
            return res.json({success: true, message: "Unauthorizaion"})
        }

        car.isAvaliable = !car.isAvaliable;
        await car.save()

        res.json({success: true, message: "Availability toggled"})
    } catch (error) {
         console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

///api to delete export
export const DeleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
    const car = await Car.findById(carId);

    if (!car) {
      return res.json({ success: false, message: "Car not found" });
    }

    if (car.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    await Car.findByIdAndDelete(carId);

    res.json({ success: true, message: "Car Deleted" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


export const getDashboardData = async (req, res) => {
    try {
        const { _id, role } = req.user;

        if (role !== 'owner') {
            return res.json({ success: false, message: "Unauthorized" });
        }

        const cars = await Car.find({ owner: _id });
        const bookings = await Booking.find({ owner: _id })
            .populate('car')
            .sort({ createdAt: -1 });

        const pendingBookings = await Booking.find({ owner: _id, status: "pending" });
        const completeBookings = await Booking.find({ owner: _id, status: "confirmed" });

        const monthlyRevenue = bookings
            .filter(booking => booking.status === 'confirmed')
            .reduce((acc, booking) => acc + booking.price, 0);

        const dashboardData = {
            totalCars: cars.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completeBookings.length, // ✅ แก้ชื่อ key ให้ตรง frontend
            recentBookings: bookings.slice(0, 3),
            monthlyRevenue
        };

        res.json({ success: true, dashboardData });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

//api upload user image
export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);

    const uploadResponse = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/users"
    });

    const optimizedImageURL = imagekit.url({
      path: uploadResponse.filePath,
      urlEndpoint: "https://ik.imagekit.io/9bzazrd0b",
      transformation: [
        { width: "480" },
        { quality: "auto" },
        { format: "web" }
      ]
    });

    await User.findByIdAndUpdate(_id, { image: optimizedImageURL });

    res.json({ success: true, message: "Image Updated" });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

