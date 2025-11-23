import React from 'react'
import NavbarDashboard from '../Components/NavbarDashboard'
import SideBarDashboard from '../Components/SideBarDashboard'
import MainPanelDashboard from '../Components/MainPanelDashboard'

const Dashboard = () => {
  return (
    <div className="dashboardContainer h-screen w-full flex flex-col overflow-hidden divide-y">
      <NavbarDashboard />

      <div className="sideBarMainContent flex flex-1 overflow-hidden divide-x border-none">
        <SideBarDashboard />
        <MainPanelDashboard />
      </div>
    </div>
  )
}

export default Dashboard
