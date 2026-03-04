import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useForm } from "react-hook-form";
import api from "../../api/axios.js";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import AddButton from "../../ui/Buttons/AddButton";
import CancelButton from "../../ui/Buttons/CancelButton";

const FacultyFeedbackStudent = () => {
  // Dummy faculty list (Replace later with API data)

  const [faculties , setFaculties] = useState([])
  const [selectedRating, setSelectedRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false); // to control rating error display

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleCancel = () => {
    reset();
    setSelectedRating(0);
    setIsSubmitted(false);
  };
  
  useEffect(()=>{
    api.get("/api/feedback/faculty-feedback").then((res)=>{
      setFaculties(res.data.data);
    }).catch((errors)=>{
      console.log(errors);
      alert("failed to fetch the faculty");
    })
  },[])
  async function onSubmit(data) {
    try {
      setIsSubmitted(true);

      if (selectedRating === 0) {
        return; // stop submission if rating not selected
      }

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/api/feedback/submit",
        {
          faculty_id: data.faculty,
          rating: selectedRating,
          comments: data.comments,
        }
      );

      console.log(res.data);
      alert("Feedback Submitted Successfully");
      reset();
      setSelectedRating(0);
      setIsSubmitted(false);
    } catch (error) {
      console.log(error);
      alert("Error Submitting Feedback");
    }
  }

  return (
    <DashboardChildPageTemplate
      title="Faculty Feedback"
      desc="Share your feedback about faculty members to help improve teaching quality"
    >
      <DashboardChildPageCard>
        <form onSubmit={handleSubmit(onSubmit)}>
          
          {/* -------- Select Faculty -------- */}
          <div className="form-field">
            <label className="custom-label">Select Faculty</label>
            <select
              className="custom-input"
              {...register("faculty", {
                required: "Please select a faculty",
              })}
            >
              <option value="">-- Select Faculty --</option>
              {faculties.map((faculty) => (
                <option
                  key={faculty.faculty_id}
                  value={faculty.faculty_id}
                >
                  {faculty.name}
                </option>
              ))}
            </select>
            {errors.faculty && (
              <p className="custom-error">{errors.faculty.message}</p>
            )}
          </div>

          {/* -------- Star Rating -------- */}
          <div className="form-field">
            <label className="custom-label">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={28}
                  onClick={() => setSelectedRating(star)}
                  className={`cursor-pointer transition-colors ${
                    star <= selectedRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-400"
                  }`}
                />
              ))}
            </div>

            {/* Show error only after submit attempt */}
            {isSubmitted && selectedRating === 0 && (
              <p className="custom-error">Please select rating</p>
            )}
          </div>

          {/* -------- Feedback Comments -------- */}
          <div className="form-field">
            <label className="custom-label">Feedback</label>
            <textarea
              rows="4"
              placeholder="Write your feedback here..."
              className="custom-input resize-none"
              {...register("comments", {
                required: "Please write your feedback",
                minLength: {
                  value: 10,
                  message: "Minimum 10 characters required",
                },
              })}
            ></textarea>
            {errors.comments && (
              <p className="custom-error">{errors.comments.message}</p>
            )}
          </div>

          {/* -------- Buttons -------- */}
          <div className="form-actions">
            <AddButton text="Submit Feedback" />
            <CancelButton onClick={handleCancel} />
          </div>
        </form>
      </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  );
};

export default FacultyFeedbackStudent;