import React from 'react'
import DashboardChildPageTemplate from '../ui/Templates/DashboardChildPageTemplate'
import DashboardChildPageCard from '../ui/Cards/DashboardChildPageCard'
import NotificationMessage from '../Components/NotificationMessage'

const NotificationPage = () => {
  return (
    <DashboardChildPageTemplate title="Notifications" desc="Stay updated with the latest announcements and important information">
        <DashboardChildPageCard>
            <NotificationMessage title="Exam TimeTable" time="3 hours ago" message="blahblahblahblah" />
        </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  )
}

export default NotificationPage