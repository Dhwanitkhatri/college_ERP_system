import React from "react";
import DashboardChildPageTemplate from "../ui/Templates/DashboardChildPageTemplate";
import EventCard from "../ui/Cards/EventCard";
import { useEffect,useState } from "react";
import api from "../api/axios.js"

export default function Events() {
const [events , setEvents] = useState([]);//fetched events will be store here

useEffect(() => {
  const token = localStorage.getItem("token"); // or wherever you stored it

  api.get("/api/event/course/", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then((res) => {
    setEvents(res.data);
  })
  .catch((error) => {
    console.log(error);
  });

}, []);

console.log(events);
  return (
    <DashboardChildPageTemplate
      title="Event Schedule"
      desc="Stay updated with all upcoming college events and activities"
      width="max-w-7xl"
    >
      <div className="gridDiv grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
  {events.map((event, index) => (
    <EventCard
      key={event.event_id}
      title={event.title}
      description={event.description}
      date={event.event_date}
      time={event.event_time}
      location={event.location}
      attendees={event.attendees_count}
    />
  ))}
</div>

    </DashboardChildPageTemplate>
  );
}
