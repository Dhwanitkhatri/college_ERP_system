import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import EditButton from "../../ui/Buttons/EditButton";
import DeleteButton from "../../ui/Buttons/DeleteButton";

const ManageNotificationsAdmin = () => {
  const navigate = useNavigate();

  /* ---------------- Dummy Notification Data ---------------- */
  /* This will later come from backend API */
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Exam Schedule Released",
      message: "Final semester exams will start from 10th March.",
      target_type: "CLASS",
      target_label: "FY-B",
      sender_role: "Faculty",
      course: "BCA",
      created_at: "20 Feb 2026",
    },
    {
      id: 2,
      title: "Holiday Notice",
      message: "College will remain closed on Friday.",
      target_type: "COURSE",
      target_label: "All Users",
      sender_role: "Admin",
      course: "BCA",
      created_at: "18 Feb 2026",
    },
  ]);

  /* 
    This state will later help us show loading per row 
    (just like ManageFacultyAdmin)
  */
  const [actionLoading, setActionLoading] = useState(null);

  /*
    This function deletes a notification.
    For now it removes from UI only (dummy).
    Later it will call backend API.
  */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?"))
      return;

    try {
      setActionLoading(id); // Start row loading

      // Later you will replace this with:
      // await api.delete(`api/notifications/${id}`)

      // Remove from UI instantly
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );

      console.log("Notification deleted successfully");
    } catch (err) {
      console.error("Error deleting notification:", err.message);
    } finally {
      setActionLoading(null); // Stop row loading
    }
  };

  /*
    This function navigates to edit page.
    It sends notification ID in URL.
  */
  const handleEdit = (id) => {
    navigate(`/admin/Dashboard/EditNotificationAdmin/${id}`);
  };

  return (
    <DashboardChildPageTemplate
      title="Manage Notifications"
      desc="View, edit, and delete system-wide notifications"
    >
      <DashboardChildPageCard>
        {/* ---------------- Table Wrapper ---------------- */}
        <div className="table-wrapper overflow-x-auto">
          <table className="w-full border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
            
            {/* ---------------- Table Head ---------------- */}
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="table-row-style font-semibold sticky-col">
                  Title
                </th>
                <th className="table-row-style font-semibold">Target</th>
                <th className="table-row-style font-semibold">Sent By</th>
                <th className="table-row-style font-semibold">Course</th>
                <th className="table-row-style font-semibold">Created At</th>
                <th className="table-row-style font-semibold text-center">
                  Actions
                </th>
              </tr>
            </thead>

            {/* ---------------- Table Body ---------------- */}
            <tbody>
              {notifications.length === 0 ? (
                /* Empty State */
                <tr>
                  <td colSpan="6" className="table-row-style text-center">
                    No notifications found.
                  </td>
                </tr>
              ) : (
                notifications.map((notification) => (
                  <tr
                    key={notification.id}
                    className="hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  >
                    {/* Title Column */}
                    <td className="table-row-style sticky-col align-middle">
                      {notification.title}
                    </td>

                    {/* Target Column */}
                    <td className="table-row-style align-middle">
                      {notification.target_type} -{" "}
                      {notification.target_label}
                    </td>

                    {/* Sender Column */}
                    <td className="table-row-style align-middle">
                      {notification.sender_role}
                    </td>

                    {/* Course Column */}
                    <td className="table-row-style align-middle">
                      {notification.course}
                    </td>

                    {/* Date Column */}
                    <td className="table-row-style align-middle">
                      {notification.created_at}
                    </td>

                    {/* Action Buttons */}
                    <td className="table-row-style align-middle">
                      
                      {/* FIXED: Flex wrapper inside td instead of on td */}
                      <div className="flex items-center justify-center gap-2">
                        
                        {/* Edit Button */}
                        <EditButton
                          onClick={() => handleEdit(notification.id)}
                          disabled={actionLoading === notification.id}
                        />

                        {/* Delete Button */}
                        <DeleteButton
                          onClick={() => handleDelete(notification.id)}
                          disabled={actionLoading === notification.id}
                        />
                      </div>

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  );
};

export default ManageNotificationsAdmin;