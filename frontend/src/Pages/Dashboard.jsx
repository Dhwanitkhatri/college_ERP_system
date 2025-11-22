import React from 'react'
import NavbarDashboard from '../Components/NavbarDashboard'
import SideBarDashboard from '../Components/SideBarDashboard'
import MainPanelDashboard from '../Components/mainPanelDashboard'

const Dashboard = () => {
  return (
    <div className="dashboardContainer h-screen w-ful flex flex-col overflow-hidden divide-y">
        <NavbarDashboard></NavbarDashboard>
        <div className="sideBarMainContent flex flex-1 overflow-hidden divide-x">
            <SideBarDashboard />
            <MainPanelDashboard />
        </div>
    </div>
  )
}

export default Dashboard