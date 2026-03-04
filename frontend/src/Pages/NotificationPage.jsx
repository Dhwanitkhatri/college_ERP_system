import React, { useEffect, useState } from 'react'
import DashboardChildPageTemplate from '../ui/Templates/DashboardChildPageTemplate'
import DashboardChildPageCard from '../ui/Cards/DashboardChildPageCard'
import NotificationMessage from '../Components/NotificationMessage'
import api from '../api/axios'

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
 

  useEffect(()=>{
    api.get("/api/notifications/my")
    .then((res)=>{
      setNotifications(res.data.notifications);
      console.log("Notifications: ",res.data);
    })
    .catch((err)=>{
      console.log("Error: ", err.response?.data || err.message);
    });
  },[])

  return (
    <DashboardChildPageTemplate 
      title="Notifications" 
      desc="Stay updated with the latest announcements and important information"
    >
      <DashboardChildPageCard>

        {notifications.length === 0 ?(
          <div>No Notification for Now</div>
        ):(

          notifications.map((notification, index)=>{

            // -------- format date & time ahiya kariye chhe --------
            const dateObj = new Date(notification.created_at);
            const formattedDate = dateObj.toLocaleDateString();
            const formattedTime = dateObj.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            });

            return (
              <NotificationMessage 
                key={index} 
                title={notification.title} 
                message={notification.message}
                sender={notification.sender_name}
                senderRole={notification.sender_role}
                date={formattedDate}
                time={formattedTime}
              />
            )
          })

        )}

      </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  )
}

export default NotificationPage
