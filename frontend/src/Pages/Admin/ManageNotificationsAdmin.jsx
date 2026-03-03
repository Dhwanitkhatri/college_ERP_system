import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import EditButton from "../../ui/Buttons/EditButton";
import DeleteButton from "../../ui/Buttons/DeleteButton";
import api from "../../api/axios.js";

const ManageNotificationsAdmin = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  /* ================= FETCH MY NOTIFICATIONS ================= */
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        

        const res = await api.get(
          "/api/notifications/my-notifications");


        const data = res?.data?.notifications;

        
        setNotifications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching notifications:", err.message);
        setNotifications([]); // prevent crash
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?"))
      return;

    try {
      setActionLoading(id);

      const token = localStorage.getItem("token");

      await api.delete(`/api/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove from UI
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
    } catch (err) {
      console.error("Error deleting notification:", err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/Dashboard/EditNotificationAdmin/${id}`);
  };

  return (
    <DashboardChildPageTemplate
      title="Manage Notifications"
      desc="View, edit, and delete system-wide notifications"
      width="max-w-6xl"
    >
      <DashboardChildPageCard>
        <div className="table-wrapper overflow-x-auto">
          <table className="w-full border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">

            {/* ================= TABLE HEADER ================= */}
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="table-row-style font-semibold sticky-col">
                  Title
                </th>
                <th className="table-row-style font-semibold">
                  Target
                </th>
                <th className="table-row-style font-semibold">
                  Sent By
                </th>
                <th className="table-row-style font-semibold">
                  Course
                </th>
                <th className="table-row-style font-semibold">
                  Created At
                </th>
                <th className="table-row-style font-semibold text-center">
                  Actions
                </th>
              </tr>
            </thead>

            {/* ================= TABLE BODY ================= */}
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="table-row-style text-center">
                    Loading notifications...
                  </td>
                </tr>
              ) : !Array.isArray(notifications) || notifications.length === 0 ? (
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
                    <td className="table-row-style sticky-col align-middle">
                      {notification.title}
                    </td>

                    <td className="table-row-style align-middle">
                      {notification.target_type}
                      {notification.class_id &&
                        ` - ${notification.class_id}`}
                    </td>

                    <td className="table-row-style align-middle">
                      {notification.sender_role}
                    </td>

                    <td className="table-row-style align-middle">
                      {notification.course_id}
                    </td>

                    <td className="table-row-style align-middle">
                      {notification.created_at
                        ? new Date(
                            notification.created_at
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="table-row-style align-middle">
                      <div className="flex items-start gap-2">
                        <EditButton
                          onClick={() =>
                            handleEdit(notification.id)
                          }
                          disabled={
                            actionLoading === notification.id
                          }
                        />

                        <DeleteButton
                          onClick={() =>
                            handleDelete(notification.id)
                          }
                          disabled={
                            actionLoading === notification.id
                          }
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
