import React from "react";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

const EventCard = ({ title, description, date, time, location, attendees }) => {
  return (
    <div className="mainDiv bg-[var(--card-bg)] border border-[var(--border-light)] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <span
        className="inline-block px-3 py-1 rounded-md text-xs font-medium mb-4 border 
        bg-gray-100 text-gray-900 border-gray-200 
        dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
      >
        Cultural
      </span>

      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
        {description}
      </p>
      <div className="wrapperDiv space-y-3">
        <div className="dateDiv flex items-center gap-3 text-sm text-[var(--text-secondary)]">
          <Calendar size={16} className="text-[var(--text-muted)]" />
          <span>{date}</span>
        </div>

        <div className="timeDiv flex items-center gap-3 text-sm text-[var(--text-secondary)]">
          <Clock size={16} className="text-[var(--text-muted)]" />
          <span>{time}</span>
        </div>

        <div className="locationDiv flex items-center gap-3 text-sm text-[var(--text-secondary)]">
          <MapPin size={16} className="text-[var(--text-muted)]" />
          <span>{location}</span>
        </div>
        <div className="attendeesDiv flex items-center gap-3 text-sm text-[var(--text-secondary)]">
          <Users size={16} className="text-[var(--text-muted)]" />
          <span>{attendees} Expected Attendees</span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
