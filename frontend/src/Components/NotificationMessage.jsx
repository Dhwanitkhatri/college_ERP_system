import { Mail } from 'lucide-react'
import React from 'react'

const NotificationMessage = ({ title, time, message }) => {
  return (
    <div className="notificationContainer border border-red-800 p-2 rounded-md m-2">
      <div className="notificationHolder flex">
        <div className="notificationIcon w-10 h-10 flex items-center justify-center rounded-full border">
          <Mail className="w-5 h-5" />
        </div>

        <div className="notificationsDetails border w-full">
          <div className="notificationHeader flex justify-between">
            <div className="notificationTitle">
              <h3>{title}</h3>
            </div>

            <div className="notificationTime">
              <span>{time}</span>
            </div>
          </div>

          <div className="notificationBody">
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationMessage