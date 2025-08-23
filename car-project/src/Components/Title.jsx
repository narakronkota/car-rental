import React from 'react'

const Title = ({title , subtiitle ,align }) => {
  return (
    <div className={`flex flex-col jusitfy-center items-center text-center ${align=== "left " && " md:items-start md:text-left"}`}>
        <h1 className='font-semibold text-4xl md:text-[50px]'>{title}</h1>
        <p className='tetx-sm md:text-base text-gray-500/90 mt-2 max-w-156'>{subtiitle}</p>

    </div>
  )
}

export default Title