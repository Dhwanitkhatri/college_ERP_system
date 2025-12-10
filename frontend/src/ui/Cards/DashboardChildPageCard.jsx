import React from 'react'

const DashboardChildPageCard = ({children}) => {
  return (
    <div className="card max-w-3xl mx-auto border border-gray-200 dark:border-gray-800 rounded-xl p-8 bg-white 
    dark:bg-gray-900 shadow-sm transition-colors duration-200">
        {children}
    </div>
  )
}

export default DashboardChildPageCard