import React from 'react'
import ActionContainerDashboard from '../ui/ActionContainerDashboard'

const MainPanelDashboard = () => {
  return (
    <div className='mainDashContentDiv bg-[var(--mainPanel-bg-color)] dark:bg-[var(--mainPanel-bg-color)] w-full p-3 border-none'>

      {/* HEADER */}
      <div className="DashHeaderDiv p-3">
        <h1 className="headerDashMain 
            text-xl font-medium mb-2 
            text-black dark:text-white">
          Welcome Back, User
        </h1>

        <p className="descDashMain text-gray-600 dark:text-gray-400">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
      </div>

      {/* CONTENT */}
      <div className="dashContentHolder p-3 items-center justify-center flex flex-wrap">
        <div className="DashContentDiv flex flex-wrap gap-3 w-full">
          <ActionContainerDashboard />
          <ActionContainerDashboard />
        </div>

        <div className="DashContentDiv flex flex-wrap gap-3 w-full">
          <ActionContainerDashboard />
          <ActionContainerDashboard />
        </div>
      </div>
    </div>
  )
}

export default MainPanelDashboard
