import { Mail } from 'lucide-react'
import React from 'react'

const NotificationMessage = (title, time, message) => {
  return (
    <div className="notificationContainer border border-red-800 p-4 rounded-md">
        <div className="notificationHolder">
            <div className="notificationIcon">
                <Mail />
            </div>
            <div className="notificationsDetails">
                <div className="notificationHeader">
                    <div className="notificationTitle">
                        <h3>{/*ahiya notification title avse*/}{title}</h3>
                    </div>
                    <div className="notificationTime">
                        <span>{/*ahiya notification time avse*/}{time}</span>
                    </div>
                </div>
                <div className="notificationBody">
                    <p>{/*ahiya notification message avse*/}{message}</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default NotificationMessage