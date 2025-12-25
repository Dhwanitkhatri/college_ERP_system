import React, { useEffect, useState } from 'react'
import DashboardChildPageTemplate from '../ui/Templates/DashboardChildPageTemplate'
import DashboardChildPageCard from '../ui/Cards/DashboardChildPageCard'
import NotificationMessage from '../Components/NotificationMessage'
import api from '../api/axios'

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(()=>{
    api.get("/api/notifications/my", {
      headers:{
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res)=>{
      setNotifications(res.data.notifications);
      console.log("Notifications: ",res.data);
    })
    .catch((err)=>{
      console.log("Error: ", err.response?.data || err.message);
    });
  },[])
  return (
    <DashboardChildPageTemplate title="Notifications" desc="Stay updated with the latest announcements and important information">
        <DashboardChildPageCard>
          {notifications.length === 0 ?(
            <div>No Notification for Now</div>
          ):(
            notifications.map((notification, index)=>(
              <NotificationMessage key={index} title={notification.title} message={notification.message} />
            ))
          )}
        </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  )
}

export default NotificationPage