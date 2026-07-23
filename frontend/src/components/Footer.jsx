import React from 'react'
import {assets} from '../assets/assets'
const Footer = () => {
  return (
    <div className="md:mx-10">
        <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm ">
            {/*----left section ----*/}

            <div>
                <img className='mb-5 w-40' src="https://static.vecteezy.com/system/resources/previews/007/874/081/non_2x/doctor-logo-healthcare-and-medical-logo-design-vector.jpg" alt="" width = "90" height="40" />
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>Providing compassionate care with expertise and dedication, we prioritize your health and well-being. Trust our clinic for reliable treatment, continuous support, and a commitment to your healthier tomorrow.</p>

            </div>
            {/*----center section ----*/}
            <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Contact us</li>
                    <li>Privacy Policy</li>
                </ul>
                
            </div>
            {/*----right section ----*/}
            <div>
              <p className='text-xl font-medium mb-5'>GET IN TOUCH</p> 
              <ul className='flex flex-col gap-2 text-gray-600'>
                <li>+9177-69-333-78</li>
                <li>vtslshivam3@gmail.com</li>
                </ul> 
            </div>
        </div>
        {/*----copyright text----*/}
        <div>
<hr/>
<p className='py-5 text-sm text-center'>Copyright 2025@ DOC+ -All Right Reserved</p>
        </div>
    </div>
  )
}

export default Footer