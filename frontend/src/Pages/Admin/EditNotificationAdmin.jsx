import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import SaveButton from "../../ui/Buttons/SaveButton";
import CancelButton from "../../ui/Buttons/CancelButton";
import api from "../../api/axios.js";

const EditNotificationAdmin = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    message: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  

  /* ---------------- FETCH NOTIFICATION BY ID ---------------- */
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const res = await api.get(
          `/api/notifications/${id}`);

        setFormData({
          title: res.data.notification.title,
          message: res.data.notification.message,
        });

      } catch (error) {
        console.error("Error fetching notification:", error);
        setError("Failed to load notification");
      } finally {
        setLoading(false);
      }
    };

    fetchNotification();
  }, [id]);

  /* ---------------- HANDLE INPUT CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ---------------- UPDATE NOTIFICATION ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(
        `/api/notifications/${id}`,
        formData,
      );

      alert("Notification updated successfully!");
      navigate("/admin/Dashboard/ManageNotificationsAdmin");

    } catch (error) {
      console.error("Error updating notification:", error);
      setError("Failed to update notification");
    }
  };

  /* ---------------- LOADING STATE ---------------- */
  if (loading) {
    return (
      <DashboardChildPageTemplate
        title="Edit Notification"
        desc="Loading notification..."
      >
        <DashboardChildPageCard>
          <p className="text-sm text-[var(--text-muted)]">
            Loading...
          </p>
        </DashboardChildPageCard>
      </DashboardChildPageTemplate>
    );
  }

  return (
    <DashboardChildPageTemplate
      title="Edit Notification"
      desc={`Editing notification ID: ${id}`}
    >
      <DashboardChildPageCard>

        {/* Error Message */}
        {error && <p className="custom-error">{error}</p>}

        <form onSubmit={handleSubmit}>

          {/* Title */}
          <div className="form-field">
            <label className="custom-label">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="custom-input"
              placeholder="Enter notification title"
              required
            />
          </div>

          {/* Message */}
          <div className="form-field">
            <label className="custom-label">Message</label>
            <textarea
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              className="custom-input resize-none"
              placeholder="Enter notification message"
              required
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="form-actions">
            
            {/* Cancel Button (NO NAVIGATION LOGIC HERE) */}
            <CancelButton />

            {/* Save Button (Your Themed Component) */}
            <SaveButton />

          </div>

        </form>
      </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  );
};

export default EditNotificationAdmin;