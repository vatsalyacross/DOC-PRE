import React from 'react'
import {assets} from '../assets/assets'
const About = () => {
  return (
    <div>
       <div className='text-center text-2x1 pt-10 text-gray-500'>
        <p>ABOUT<span className='text-gray-700 font-medium'>US</span></p>
        </div> 

        <div className='my-10 flex flex-col md:flex-row gap-12'>
          <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
            <p>Welcome to Doc+, your trusted partner for smarter, faster, and reliable healthcare solutions,where innovation meets care to simplify</p>
            <p>A seamless platform delivering innovation, efficiency, and user-friendly solutions for modern needs.</p>
            <b className='text-gray-800'>Our vision</b>
            <p>Our vision is to transform healthcare access through innovation, trust, and seamless digital experiences.</p>
          </div>
        </div>

,
<div className='text-xl my-4'>
  <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
</div>

<div className='flex flex-col md:flex-row mb-20'>
  <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
<b>Effeciency:</b>
<p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
  </div>
  <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
<b>Convenience:</b>
<p>Access to a network of trusted healthcare proffesionals in your area.</p>
  </div>
  <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
<b>Personalization:</b>
<p>Tailored reccomendations and reminders to help you stay on top of your health.</p>
  </div>
</div>

    </div>
  )
}

export default About