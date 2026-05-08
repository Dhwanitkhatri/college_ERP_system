import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import CancelButton from "../../ui/Buttons/CancelButton";
import { Save } from "lucide-react";
import api from "../../api/axios.js";

const EditEventAdmin = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    api.get("/api/event/course/")
    .then((res) => {
      const event = res.data.find(e => e.event_id === parseInt(id));
      if (event) {
        setValue("title", event.title);
        setValue("category", event.category);
        setValue("description", event.description);
        setValue("date", event.event_date);
        setValue("time", event.event_time);
        setValue("location", event.location);
      }
    });
  }, [id, setValue]);

  const onSubmit = (data) => {

    api.put(`/api/event/${id}`,{
      category : data.category,
      title : data.title,
      description : data.description,
      event_date : data.date,
      event_time : data.time,
      location : data.location,
    })
    .then(()=>{
      alert("Event updated successfully");
      navigate("/admin/dashboard/events");
    })
    .catch((err)=>{
      console.log(err);
      alert("Update failed");
    });
  };

  return (
    <DashboardChildPageTemplate title="Edit Event" desc="Edit Your Created Events">
      <div className="pb-20">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DashboardChildPageCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* this is the event title part */}
              <div className="col-span-1 md:col-span-2">
                <label className="custom-label mb-2">Event Title</label>
                <input
                  type="text"
                  className="custom-input bg-[var(--bg-primary)] theme-transition"
                  {...register("title", { required: "Event title is required" })}
                />
                {errors.title && <p className="custom-error">{errors.title.message}</p>}
              </div>

              {/* this is the category part */}
              <div>
                <label className="custom-label mb-2">Category</label>
                <select
                  className="custom-input bg-[var(--bg-primary)] theme-transition"
                  {...register("category", { required: "Select a category" })}
                >
                  <option value="">Select Category</option>
                  <option value="academic">Academic</option>
                  <option value="culture">Culture</option>
                  <option value="sports">Sports</option>
                </select>
                {errors.category && <p className="custom-error">{errors.category.message}</p>}
              </div>

              {/* this is the event date part */}
              <div>
                <label className="custom-label mb-2">Event Date</label>
                <input
                  type="date"
                  className="custom-input bg-[var(--bg-primary)] theme-transition"
                  {...register("date", { required: "Date is required" })}
                />
                {errors.date && <p className="custom-error">{errors.date.message}</p>}
              </div>

              {/* this is the event time part */}
              <div>
                <label className="custom-label mb-2">Event Time</label>
                <input
                  type="time"
                  className="custom-input bg-[var(--bg-primary)] theme-transition"
                  {...register("time", { required: "Time is required" })}
                />
                {errors.time && <p className="custom-error">{errors.time.message}</p>}
              </div>

              {/* this is the location part */}
              <div className="col-span-1 md:col-span-2">
                <label className="custom-label mb-2">Location</label>
                <input
                  type="text"
                  className="custom-input bg-[var(--bg-primary)] theme-transition"
                  {...register("location", { required: "Location is required" })}
                />
                {errors.location && <p className="custom-error">{errors.location.message}</p>}
              </div>

              {/* this is the description part */}
              <div className="col-span-1 md:col-span-2">
                <label className="custom-label mb-2">Description</label>
                <textarea
                  rows="4"
                  className="custom-input bg-[var(--bg-primary)] theme-transition resize-none"
                  {...register("description")}
                ></textarea>
              </div>

            </div>

          </DashboardChildPageCard>

          {/* below is the buttons part  */}
          <div className="flex justify-end gap-4 mt-6">
            <CancelButton onClick={() => navigate("/admin/dashboard/events")} />

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 bg-[var(--btn-primary-bg)]
                  text-[var(--btn-primary-text)]"
            >
              <Save size={18} />
              Update Event
            </button>
          </div>

        </form>
      </div>
    </DashboardChildPageTemplate>
  );
};

export default EditEventAdmin;
