import React from 'react'
import SideBarButton from '../ui/SideBarButton'
import { LayoutDashboard } from 'lucide-react'
import SideBarLogoutButton from '../ui/SideBarLogoutButton'

const SideBarDashboard = () => {
  return (
    <div className="sidebarMainDiv p-[1%] border w-72 h-full flex flex-col space-y-3 border-t-0">
      <SideBarButton to="/Dashboard" label="Dashboard" icon={LayoutDashboard} />
      <SideBarButton to="/Dashboard" label="Dashboard" icon={LayoutDashboard}/>
      <SideBarButton to="/Dashboard" label="Dashboard" icon={LayoutDashboard}/>
      <SideBarButton to="/Dashboard" label="Dashboard" icon={LayoutDashboard}/>
      <div className="logoutButton border-t pt-[5%]">
        <SideBarLogoutButton />
      </div>
    </div>
  )
}

export default SideBarDashboard