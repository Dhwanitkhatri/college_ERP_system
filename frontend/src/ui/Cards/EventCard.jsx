import React from "react";
import { Calendar, Clock, MapPin, Users, Pencil, Trash2 } from "lucide-react";

const EventCard = ({ 
  event_id,
  title, 
  category,
  description, 
  date, 
  time, 
  location, 
  attendees,
  isAdmin = false,
  onEdit,
  onDelete
}) => {
  return (
    <div className="mainDiv bg-[var(--card-bg)] border border-[var(--border-light)] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      
      <span
        className="inline-block px-3 py-1 rounded-md text-xs font-medium mb-4 border 
        bg-gray-100 text-gray-900 border-gray-200 
        dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
      >
        {category}
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

      {/* Admin Buttons */}
      {isAdmin && (
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => onEdit(event_id)}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-[var(--border-light)] 
                       bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:opacity-90 transition"
          >
            <Pencil size={16} />
            Edit
          </button>

          <button
            onClick={() => onDelete(event_id)}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg 
                       bg-red-600 text-white hover:opacity-90 transition"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default EventCard;
