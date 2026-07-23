import React, {useContext}from 'react'
import {assets} from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'
const Navbar = () => {

    const {aToken,setAToken} = useContext(AdminContext)
    const {dToken,setdToken} = useContext(DoctorContext)

    const navigate = useNavigate()

    // const logout =() =>{
    //     navigate('/')
    //     aToken && setAToken('')
    //     aToken && localStorage.removeItem('aToken')
    // }
    const logout = () => {
  localStorage.removeItem('aToken')
  localStorage.removeItem('dToken')

  setAToken('')

  if (setdToken) {
    setdToken('')
  }

  navigate('/')
}
  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
<div className='flex items-center gap-2 text-xs'>
    <img className='w-36 sm:w-40 cursor-pointer' src="https://static.vecteezy.com/system/resources/previews/007/874/081/non_2x/doctor-logo-healthcare-and-medical-logo-design-vector.jpg"alt="" width = "100" height= "50"/>    
    <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{aToken ? 'Admin' : 'Doctor'}</p>
</div>
<button onClick={logout} className='bg-primary text-white text-sm px-10 py-2 rounded-full'>Logout</button>
    </div>
  )
}

export default Navbar