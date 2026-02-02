import React from "react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import CancelButton from "../../ui/Buttons/CancelButton";
import { Save } from "lucide-react";

export default function CreateEventAdmin() {
  return (
    <DashboardChildPageTemplate
      title="Create Event"
      desc="Create and schedule new college events"
      width="max-w-6xl"
    >
      <div className="pb-20">
        <form>
          <DashboardChildPageCard>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* this is the event title part*/}
              <div className="col-span-1 md:col-span-2">
                <label className="custom-label mb-2">Event Title</label>
                <input
                  type="text"
                  className="custom-input bg-[var(--bg-primary)] theme-transition"
                  placeholder="Enter event title"
                />
              </div>

              {/* this is the event category part */}
              <div className="col-span-1">
                <label className="custom-label mb-2">Category</label>
                <select
                  className="custom-input bg-[var(--bg-primary)] theme-transition"
                  defaultValue=""
                >
                  <option value="">Select Category</option>
                  <option value="Academic">Academic</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>

              {/* this is the attendees part */}
              <div className="col-span-1">
                <label className="custom-label mb-2">Attendees</label>
                <input
                  type="number"
                  className="custom-input bg-[var(--bg-primary)] theme-transition"
                  placeholder="0"
                />
              </div>

              {/* this is the event date part*/}
              <div className="col-span-1">
                <label className="custom-label mb-2">Event Date</label>
                <div className="relative">
                  <input
                    type="date"
                    className="custom-input w-full bg-[var(--bg-primary)] theme-transition"
                  />
                </div>
              </div>

              {/* this is the event time part */}
              <div className="col-span-1">
                <label className="custom-label mb-2">Event Time</label>
                <div className="relative">
                  <input
                    type="time"
                    className="custom-input w-full bg-[var(--bg-primary)] theme-transition"
                  />
                </div>
              </div>

              {/* this is the location part*/}
              <div className="col-span-1 md:col-span-2">
                <label className="custom-label mb-2">Location</label>
                <input
                  type="text"
                  className="custom-input bg-[var(--bg-primary)] theme-transition"
                  placeholder="Enter event location"
                />
              </div>

              {/* this is the description part */}
              <div className="col-span-1 md:col-span-2">
                <label className="custom-label mb-2">Description</label>
                <textarea
                  rows="4"
                  className="custom-input bg-[var(--bg-primary)] theme-transition resize-none"
                  placeholder="Enter event details..."
                ></textarea>
              </div>
            </div>
          </DashboardChildPageCard>

          {/* this part include the cancel button and the create event button  */}
          <div className="flex justify-end gap-4 mt-6">
            <CancelButton />

            <button
              type="button"
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 bg-[var(--btn-primary-bg)]
                  text-[var(--btn-primary-text)]"
            >
              <Save size={18} />
              Create Event
            </button>
          </div>
        </form>
      </div>
    </DashboardChildPageTemplate>
  );
}
