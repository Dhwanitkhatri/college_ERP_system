import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";

const EditNotificationAdmin = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get notification ID from URL

  /* ---------------- Dummy Pre-filled Data ---------------- */
  /* Later this will come from API using ID */
  const [formData, setFormData] = useState({
    title: "Exam Schedule Released",
    message: "Final semester exams will start from 10th March.",
  });

  /* ---------------- Handle Input Change ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ---------------- Handle Save (Dummy) ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Updated Notification:", formData);

    alert("Notification updated successfully!");

    navigate("/admin/Dashboard/ManageNotificationsAdmin");
  };

  return (
    <DashboardChildPageTemplate
      title="Edit Notification"
      desc={`Editing notification ID: ${id}`}
    >
      <DashboardChildPageCard>

        <form onSubmit={handleSubmit}>

          {/* ---------------- Title Field ---------------- */}
          <div className="form-field">
            <label className="custom-label">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="custom-input"
              required
            />
          </div>

          {/* ---------------- Message Field ---------------- */}
          <div className="form-field">
            <label className="custom-label">Message</label>
            <textarea
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              className="custom-input"
              required
            ></textarea>
          </div>

          {/* ---------------- Action Buttons ---------------- */}
          <div className="form-actions">

            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => navigate("/admin/manage-notifications")}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>

            {/* Save Button */}
            <button
              type="submit"
              className="px-4 py-2 rounded-md"
              style={{
                backgroundColor: "var(--Submit-Btn-General)",
                color: "white",
              }}
            >
              Save Changes
            </button>

          </div>
        </form>

      </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  );
};

export default EditNotificationAdmin;