import React from 'react'
import ActionContainerDashboard from '../ui/ActionContainerDashboard'

const mainPanelDashboard = () => {
  return (
    <div className='mainDashContentDiv bg-[var(--mainPanel-bg-color)] w-full p-3'>
        <div className="DashHeaderDiv p-3">
            <h1 className="headerDashMain text-xl font-medium mb-2">Welcome Back, User</h1>
            <p className="descDashMain text-[var(--light-text)]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt, cupiditate!</p>
        </div>
        <div className="dashContentHolder p-3 items-center justify-center flex flex-wrap">
            <div className="DashContentDiv flex flex-wrap gap-3 w-full">
                <ActionContainerDashboard title=""/>
                <ActionContainerDashboard title=""/>
            </div>
            <div className="DashContentDiv flex flex-wrap gap-3 w-full">
                <ActionContainerDashboard title=""/>
                <ActionContainerDashboard title=""/>
            </div>
        </div>
    </div>
  )
}

export default mainPanelDashboard