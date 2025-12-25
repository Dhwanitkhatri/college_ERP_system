import { Mail } from 'lucide-react'
import React from 'react'

const NotificationMessage = ({ title, time, message }) => {
  return (
    <div className="notificationContainer theme-transition border border-[var(--border-light)] p-2 rounded-md m-2 hover:bg-[var(--notification-hover)]">
      <div className="notificationHolder flex gap-2 items-center">
        <div className="notificationIcon w-10 h-10 flex items-center justify-center rounded-full ">
          <Mail className="w-5 h-5 text-[var(--icon-color)]" />
        </div>

        <div className="notificationsDetails w-full">
          <div className="notificationHeader flex justify-between">
            <div className="notificationTitle text-[var(--text-primary)]">
              <h3>{title}</h3>
            </div>

            <div className="notificationTime text-[var(--text-light)]">
              <span>{time}</span>
            </div>
          </div>

          <div className="notificationBody text-[var(--text-muted)]">
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationMessage