import React from 'react'
import SideBarButton from '../ui/SideBarButton'
import { LayoutDashboard } from 'lucide-react'
import SideBarLogoutButton from '../ui/SideBarLogoutButton'

const SideBarDashboard = () => {
  return (
    <div className="sidebarMainDiv p-[1%] w-72 h-full flex flex-col space-y-3 border-t-0 border-r-[0.8px] border-r-[var(--light-border)]
      bg-white dark:bg-gray-900 dark:border-gray-700 dark:border-r-[var(--light-border)]">

      <SideBarButton to="/Dashboard" label="Dashboard" icon={LayoutDashboard}/>
      <SideBarButton to="/Dashboard" label="Dashboard" icon={LayoutDashboard}/>
      <SideBarButton to="/Dashboard" label="Dashboard" icon={LayoutDashboard}/>
      <SideBarButton to="/Dashboard" label="Dashboard" icon={LayoutDashboard}/>

      <div className="logoutButton border-t pt-[5%] dark:border-gray-700">
        <SideBarLogoutButton />
      </div>
    </div>
  )
}

export default SideBarDashboard
