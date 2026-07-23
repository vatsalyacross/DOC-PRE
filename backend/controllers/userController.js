import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import razorpay from 'razorpay'


// API to register  user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.json({ success: false, message: "All fields are required" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password with minimum 8 characters" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword,

        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.json({ success: true, message: "User registered successfully", token })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, message: "Login successful", token })
        } else {
            res.json({ success: false, message: "Invalid password" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// APi to get user info
const getProfile = async (req, res) => {
    try {
        const  userId  = req.userId
        const userData = await userModel.findById(userId).select('-password')
        res.json({ success: true, userData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


const updateProfile = async (req, res) => {
  try {

    const userId = req.userId
    const { name, phone, address, dob, gender } = req.body
    const imageFile = req.file

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "All fields are required" })
    }

    let updateData = {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender
    }

    if (imageFile) {

      const imageUpload = await cloudinary.uploader.upload(
        imageFile.path,
        { resource_type: "image" }
      )

      updateData.image = imageUpload.secure_url
    }

    await userModel.findByIdAndUpdate(userId, updateData)

    res.json({
      success: true,
      message: "Profile updated successfully"
    })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}
//APi to book appointment
const bookAppointment = async (req, res) => {
    try {
        console.log("UserID:", req.userId)
        const {  docId, slotDate, slotTime } = req.body
        const userId = req.userId

        const docData = await doctorModel.findById(docId).select('-password')

        if (!docData.available) {
            return res.json({ success: false, message: "Doctor is not available" })
        }

        let slots_booked = docData.slots_booked

        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: "Slot already booked" })
            }else{
                slots_booked[slotDate].push(slotTime)
            }
        }else{
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked
        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

            await doctorModel.findByIdAndUpdate(docId, { slots_booked })
            res.json({ success: true, message: "Appointment booked successfully" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// API to get user appointments
const getUserAppointments = async (req, res) => {
  try {

    const userId = req.userId;

    const appointments = await appointmentModel
      .find({ userId })
      .sort({ date: -1 });

    res.json({
      success: true,
      appointments
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// //Api to cancel appointment
// const cancelAppointment = async (req, res) => {
//     try {

//         const {userId, appointmentId} = req.body

//         const appointmentData = await appointmentModel.findById(appointmentId)

//         if (!appointmentData.userId !== userId) {
//             return res.json({ success: false, message: "Appointment not found" })
//         }

//         await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

//         // Remove the slot from doctor's booked slots
//         const {docId, slotDate, slotTime} = appointmentData

//         const doctorData = await doctorModel.findById(docId)

//         let slots_booked = doctorData.slots_booked

//         slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

//         await doctorModel.findByIdAndUpdate(docId, { slots_booked })

//         res.json({ success: true, message: "Appointment cancelled successfully" })
        

//     }catch (error){
//     console.log(error)
//     res.json({ success: false, message: error.message })    

// }

// }

// API to cancel appointment
const cancelAppointment = async (req, res) => {
  try {

    const { appointmentId } = req.body
    const userId = req.userId   // ✅ get from auth middleware

    // Find appointment
    const appointmentData = await appointmentModel.findById(appointmentId)

    if (!appointmentData) {
      return res.json({
        success: false,
        message: "Appointment not found"
      })
    }

    // Check appointment belongs to user
    if (appointmentData.userId.toString() !== userId) {
      return res.json({
        success: false,
        message: "Unauthorized action"
      })
    }

    // Cancel appointment
    await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { cancelled: true }
    )

    // Remove booked slot from doctor
    const { docId, slotDate, slotTime } = appointmentData

    const doctorData = await doctorModel.findById(docId)

    // let slots_booked = doctorData.slots_booked

    // slots_booked[slotDate] =
    //   slots_booked[slotDate].filter(
    //     time => time !== slotTime
    //   )

    let slots_booked = doctorData.slots_booked || {}

// ✅ check date exists before filtering
if (slots_booked[slotDate]) {
  slots_booked[slotDate] =
    slots_booked[slotDate].filter(
      time => time !== slotTime
    )

  // optional cleanup
  if (slots_booked[slotDate].length === 0) {
    delete slots_booked[slotDate]
  }
}

    await doctorModel.findByIdAndUpdate(docId, { slots_booked })

    res.json({
      success: true,
      message: "Appointment cancelled successfully"
    })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}


const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

//Api to make payment
const paymentRazorpay = async (req, res) => {
  try {

    const {appointmentId} = req.body

  const appointmentData = await appointmentModel.findById(appointmentId)

  if (!appointmentData || appointmentData.cancelled) {
    return res.json({ success: false, message: "Invalid appointment" })
  }

  //creating options for razorpay
  const options = {
    amount: appointmentData.amount * 100, // amount in paise
    currency: process.env.CURRENCY,
    receipt: appointmentId,
  }

  //creating order
  const order = await razorpayInstance.orders.create(options)

  res.json({
    success: true,
    order
  })
} catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}


//Api to verify payment
const verifyRazorpay = async (req, res) => {
  try {

    const { razorpay_order_id } = req.body

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

    console.log(orderInfo)

    res.json({
      success: true,
      orderInfo
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}
  
  

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, getUserAppointments, cancelAppointment, paymentRazorpay, verifyRazorpay }