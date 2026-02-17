import { Mail } from 'lucide-react'
import React from 'react'

const NotificationMessage = ({ title, message, sender, senderRole, date, time }) => {
  return (
    <div className="notificationContainer theme-transition border border-[var(--border-light)] p-3 rounded-md m-2 hover:bg-[var(--notification-hover)]">

      <div className="notificationHolder flex gap-3 items-start">

        <div className="notificationIcon w-10 h-10 flex items-center justify-center rounded-full">
          <Mail className="w-5 h-5 text-[var(--icon-color)]" />
        </div>

        <div className="notificationsDetails w-full">

          {/* -------- Header Section -------- */}
          <div className="notificationHeader flex justify-between items-start">

            <div className="notificationTitle text-[var(--text-primary)]">
              <h3 className="font-semibold">{title}</h3>

              {/* -------- Sent By Info ahiya chhe -------- */}
              <div className="text-xs text-[var(--text-light)] mt-1">
                Sent by: <span className="font-medium">{sender}</span> ({senderRole})
              </div>
            </div>

            {/* -------- Date & Time ahiya chhe -------- */}
            <div className="notificationTime text-xs text-[var(--text-light)] text-right">
              <div>{date}</div>
              <div>{time}</div>
            </div>

          </div>

          {/* -------- Body Section -------- */}
          <div className="notificationBody text-[var(--text-muted)] mt-2">
            <p>{message}</p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default NotificationMessage
