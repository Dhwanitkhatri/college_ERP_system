import React from "react";
import DashboardChildPageTemplate from "../ui/Templates/DashboardChildPageTemplate";
import EventCard from "../ui/Cards/EventCard";
import api from "../api/axios.js"

export default function Events() {
  return (
    <DashboardChildPageTemplate
      title="Event Schedule"
      desc="Stay updated with all upcoming college events and activities"
      width="max-w-7xl"
    >
      <div className="gridDiv grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
        <EventCard
          title="Annual College Day Celebration"
          description="Join us for the annual college day celebration featuring cultural performances, awards ceremony, and guest speakers."
          date="December 28, 2025"
          time="10:00 AM - 4:00 PM"
          location="Main Auditorium"
          attendees="500"
        />
        <EventCard
          title="Tech Symposium 2025"
          description="A technical symposium featuring workshops on AI, Machine Learning, and Cloud Computing by industry experts."
          date="December 28, 2025"
          time="10:00 AM - 4:00 PM"
          location="Main Auditorium"
          attendees="500"
        />
        <EventCard
          title="Sports Day"
          description="Inter-college sports competition including cricket, football, basketball, and athletics."
          date="December 28, 2025"
          time="10:00 AM - 4:00 PM"
          location="Main Auditorium"
          attendees="500"
        />
        <EventCard
          title="Career Counseling Workshop"
          description="Career guidance session for final year students with industry professionals and alumni."
          date="December 28, 2025"
          time="10:00 AM - 4:00 PM"
          location="Main Auditorium"
          attendees="500"
        />
        <EventCard
          title="Science Exhibition"
          description="Student projects and innovations on display. Open to all departments."
          date="December 28, 2025"
          time="10:00 AM - 4:00 PM"
          location="Main Auditorium"
          attendees="500"
        />
      </div>
    </DashboardChildPageTemplate>
  );
}
