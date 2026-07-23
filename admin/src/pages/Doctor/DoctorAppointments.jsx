// import React from 'react'
// import { useContext,useEffect } from 'react'
// import { DoctorContext } from '../../context/DoctorContext'


// const DoctorAppointments = () => {

//     const {dToken, appointments, getAppointments} = useContext(DoctorContext)
//     useEffect(() => {
//         if(dToken){
//             getAppointments()
//         }
//     }, [dToken])
//   return (
//     <div className='w-full max-w-6xl m-5'>
//         <p className='mb-3 text-lg font-medium'>All appointments</p>
//         <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
//             <div className='max-sm:hidden grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b '>
//                 <p>#</p>
//                 <p>Patient</p>
//                 <p>Payment</p>
//                 <p>Age</p>
//                 <p>Date & Time</p>
//                 <p>Fees</p>
//                 <p>Action</p>
//             </div>
//         </div>
//     </div>
//   )
// }

// export default DoctorAppointments
import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'

const DoctorAppointments = () => {

  const { dToken, appointments, getAppointments } = useContext(DoctorContext)
  const {calculateAge,slotDateFormat} = useContext(AppContext)

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  return (
    <div className='w-full max-w-6xl m-5'>

      <p className='mb-3 text-lg font-medium'>
        All Appointments
      </p>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>

        {/* Table Header */}
        <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr] gap-1 py-3 px-6 border-b font-semibold text-gray-700'>
          <p>#</p>
          <p>Patient</p>y
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {/* Appointments List */}
        {
            appointments.map((item,index) => (
                <div key={index}>
                    <p>{index + 1}</p>
                    <div>
                        <img src={item.userData.image} alt="" /><p>{item.userData.name}</p>
                        </div>
                        <div>
                            <p>
                                {item.payment ? "online" : "cash"}
                            </p>
                        </div>
                        <p>{calculateAge(item.userData.dob)}</p>
                        <p>{slotDateFormat(item.slotDate)},{item.slotTime}</p>
                </div>
            ))
        
        }

      </div>
    </div>
  )
}

export default DoctorAppointments