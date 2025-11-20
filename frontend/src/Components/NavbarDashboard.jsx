import { useState } from "react"
import React from 'react'
import { X, Bell, Moon,CircleUserRound } from "lucide-react"

const NavbarDashboard = () => {
    return (
        <div className="navMainDiv bg-[var(--primary-color)] flex justify-between items-center border border-b-[0.8px] py-[0.8%]">
            <div className="navLeftDiv flex items-center gap-3 ml-[1%]">
                <div className="navSideBarBtnDiv flex items-center justify-center p-2 rounded-lg hover:bg-gray-200 cursor-pointer"><X /></div>
                <div className="navTitleDiv items-center justify-center"><h2>College ERP - User Dashboard</h2></div>
            </div>
            <div className="navRightDiv flex items-center gap-5 mr-[1%]">
                <div className="navNotificationBtnDiv p-2 rounded-lg hover:bg-gray-200 cursor-pointer"><Bell /></div>
                <div className="navThemeBtnDiv p-2 rounded-lg hover:bg-gray-200 cursor-pointer"><Moon /></div>
                <div className="navUserInfoDiv border-l-[0.8px] flex items-center gap-4">
                    <div className="navUserNameDiv">
                        <p className="navUserNamePara text-right ml-3">User Name</p>
                        <p className="navUserRolePara text-[var(--light-text)] text-right ml-3">User Role</p>
                    </div>
                    <div className="navUserPictureDiv"><CircleUserRound /></div>
                </div>
            </div>
        </div>
    )
}

export default NavbarDashboard