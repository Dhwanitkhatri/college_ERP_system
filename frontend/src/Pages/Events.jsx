import React from "react";
import DashboardChildPageTemplate from "../ui/Templates/DashboardChildPageTemplate";
import EventCard from "../ui/Cards/EventCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { getUserRole } from "../utils/auth"; // adjust path if needed

export default function Events() {
  const [events, setEvents] = useState([]); //fetched events will be store here
  const navigate = useNavigate();

  /* role state to check if user is admin */
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    /* ===== Get role from token ===== */
    const role = getUserRole();

    if (role === "Admin") {
      // ✅ case fixed
      setIsAdmin(true);
    }

    api
      .get("/api/event/course/")
      .then((res) => {
        setEvents(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/Dashboard/EditEventAdmin/${id}`);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?",
    );
    if (!confirmDelete) return;

    api
      .delete(`/api/event/${id}`)
      .then(() => {
        setEvents(events.filter((event) => event.event_id !== id));
        alert("Event deleted successfully");
      })
      .catch((err) => {
        console.log(err);
        alert("Failed to delete event");
      });
  };

  return (
    <DashboardChildPageTemplate
      title="Event Schedule"
      desc="Stay updated with all upcoming college events and activities"
      width="max-w-7xl"
    >
      <div className="pb-10">
        {events.length === 0 ? (
          // ✅ EMPTY STATE UI
          <div
            className="flex flex-col items-center justify-center text-center py-16 px-4 rounded-lg border theme-transition
      bg-[var(--bg-secondary)] border-[var(--border-light)]"
          >
            <p className="text-lg font-semibold text-[var(--text-primary)]">
              No Events Available
            </p>

            <p className="text-sm mt-2 text-[var(--text-muted)]">
              There are currently no events scheduled. Please check back later.
            </p>
          </div>
        ) : (
          // ✅ EVENTS GRID
          <div className="gridDiv grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.event_id}
                event_id={event.event_id}
                category={event.category}
                title={event.title}
                description={event.description}
                date={event.event_date}
                time={event.event_time}
                location={event.location}
                attendees={event.attendees}
                isAdmin={isAdmin}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardChildPageTemplate>
  );
}
