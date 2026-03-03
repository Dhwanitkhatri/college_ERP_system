import { ChevronDown, Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../api/axios.js";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate.jsx";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard.jsx";

export default function SendNotificationAdmin() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const sendTo = watch("sendTo");
  const [allUsers, setAllUsers] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
 
  useEffect(() => {
    if (sendTo === "Individual") {
      api
        .get("api/notifications/users-for-notification")
        .then((res) => setAllUsers(res.data.allUsers))
        .catch((err) => console.error(err.response?.data || err.message));
    }

    if (sendTo === "Class") {
      api
        .get("api/notifications/classes")
        .then((res) => setAllUsers(res.data))
        .catch((err) => console.error(err.response?.data || err.message));
    }

    setSelectedItems([]);
  }, [sendTo]);

  const handleCheckboxChange = (item) => {
    setSelectedItems((prev) =>
      prev.find((i) => i.id === item.id && i.role === item.role)
        ? prev.filter((i) => !(i.id === item.id && i.role === item.role))
        : [...prev, item]
    );
  };

  async function onSubmit(data) {
    const payload = {
      title: data.title,
      message: data.message,
    };

    // ALL USERS (COURSE)//this is done
    if (data.sendTo === "Course") {
      payload.target_type = "COURSE";
    }

    // ALL STUDENTS
    else if (data.sendTo === "Student") {
      payload.target_type = "ROLE";
      payload.receiver_role = "Student";
    }

    // ALL FACULTY
    else if (data.sendTo === "Faculty") {
      payload.target_type = "ROLE";
      payload.receiver_role = "Faculty";
    }

    // SPECIFIC CLASS this is done 
    else if (data.sendTo === "Class") {
      if (selectedItems.length === 0) {
        alert("Please select at least one class");
        return;
      }

      payload.target_type = "CLASS";
      payload.class_id = selectedItems.map((c) => c.id);
    }

    // INDIVIDUAL
    else if (data.sendTo === "Individual") {
      if (selectedItems.length === 0) {
        alert("Please select at least one user");
        return;
      }

      payload.target_type = "INDIVIDUAL";
      payload.receivers = selectedItems.map((u) => ({
    receiver_id: u.id,
    receiver_role: u.role,
  }));
    }

    else {
      alert("Please select target");
      return;
    }

    try {
      await api.post(
        "/api/notifications/send",
        payload,
      );

      alert("Notification sent successfully");
      setSelectedItems([]);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to send notification");
    }
  }

  return (
    <DashboardChildPageTemplate
      title="Send Notifications"
      desc="Send announcements and notifications to students and faculty"
    >
      <DashboardChildPageCard>
        <form
          className="sendNotificationForm"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="sendToRow grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* -------- send to field ahiya chhe -------- */}
            <div className="sendToDiv form-field">
              <label className="sendToLabel custom-label">Send To</label>

              <div className="relative">
                <select
                  defaultValue=""
                  className="sendToInput custom-input appearance-none cursor-pointer"
                  {...register("sendTo", {
                    required: "Please select an option",
                  })}
                >
                  <option value="" disabled>
                    Select send to
                  </option>
                  <option value="Course">All Users</option>
                  <option value="Student">All Students</option>
                  <option value="Faculty">All Faculty</option>
                  <option value="Class">Specific Class</option>
                  <option value="Individual">Individual User</option>
                </select>

                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-500 dark:text-[#9ca3af]" />
                </div>
              </div>

              {errors.sendTo && (
                <p className="custom-error">{errors.sendTo.message}</p>
              )}
            </div>
          </div>

          {/* -------- optional field ahiya chhe -------- */}
          {(sendTo === "Individual" || sendTo === "Class") && (
            <div className="form-field">
              <label className="custom-label">
                {sendTo === "Individual" ? "Select Users" : "Select Classes"}
              </label>

              <div
                className="custom-input"
                style={{
                  maxHeight: "220px",
                  overflowY: "auto",
                  padding: "0.75rem",
                }}
              >
                {allUsers.map((u) => (
                  <div
                    key={`${u.role}|${u.id}`}
                    className="flex items-center gap-3 py-2 border-b border-gray-200 dark:border-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={
                        selectedItems.find(
                          (i) => i.id === u.id && i.role === u.role
                        ) !== undefined
                      }
                      onChange={() => handleCheckboxChange(u)}
                      className="cursor-pointer"
                    />

                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>{u.id}</strong> | {u.name || u.role} |{" "}
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------------- title field ahiya chhe ---------------- */}
          <div className="titleDiv form-field">
            <label className="titleLabel custom-label">Title</label>

            <input
              type="text"
              placeholder="Enter notification title"
              className="titleInput custom-input"
              {...register("title", {
                required: "Please enter title",
                minLength: {
                  value: 3,
                  message: "Minimum 3 characters required",
                },
                maxLength: {
                  value: 100,
                  message: "Maximum 100 characters allowed",
                },
              })}
            />

            {errors.title && (
              <p className="custom-error">{errors.title.message}</p>
            )}
          </div>

          {/* ---------------- message field ahiya chhe ---------------- */}
          <div className="messageDiv form-field">
            <label className="messageLabel custom-label">Message</label>

            <textarea
              rows={6}
              placeholder="Enter your message here..."
              className="messageInput custom-input resize-none"
              {...register("message", {
                required: "Please enter message",
                minLength: {
                  value: 5,
                  message: "Minimum 5 characters required",
                },
                maxLength: {
                  value: 3000,
                  message: "Maximum 3000 characters allowed",
                },
              })}
            />

            {errors.message && (
              <p className="custom-error">{errors.message.message}</p>
            )}
          </div>

          {/* ---------------- buttons ahiya chhe ---------------- */}
          <div className="form-actions">
            <button
              type="submit"
              className="flex items-center gap-2 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black px-6 py-2.5 rounded-md text-sm font-medium"
            >
              <Send size={16} />
              Send Notification
            </button>
          </div>
        </form>
      </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  );
}