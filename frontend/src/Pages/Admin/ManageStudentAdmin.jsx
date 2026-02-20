import React from "react";
import ManageUserTemplateAdmin from "../../ui/Templates/ManageUserTemplateAdmin";
import EditButton from "../../ui/Buttons/EditButton";
import DeleteButton from "../../ui/Buttons/DeleteButton.jsx";
import ActivateDeactivateButton from "../../ui/Buttons/ActivateDeactivateButton.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";

const ManageStudentAdmin = () => {
  const token = localStorage.getItem("token"); // Get token from localStorage
  const navigate = useNavigate(); //for navigating

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // Row action loading state

  // Fetch all students when component loads
  useEffect(() => {
    api
      .get("api/students/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setStudents(res.data); // backend sends array
        setLoading(false);
        console.log("Fetched students:", res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.error(
          "Error fetching students:",
          err.response?.data || err.message
        );
      });
  }, [token]);

  /*
    This function deletes a student.
    It calls backend and removes student from UI state.
  */
  const deleteStudent = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this student?"
      )
    )
      return;

    try {
      setActionLoading(id); // Start row loading

      await api.delete(`api/students/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Student deleted successfully");

      // Remove from UI instantly
      setStudents((prev) => prev.filter((student) => student.id !== id));
    } catch (err) {
      console.error(
        "Error deleting student:",
        err.response?.data || err.message
      );
    } finally {
      setActionLoading(null); // Stop row loading
    }
  };

  /*
    This function toggles student active/inactive status.
    It sends PUT request to backend and updates UI instantly.
  */
  const toggleStudentStatus = async (userId) => {
    if (!window.confirm("Are you sure you want to change status?")) return;

    try {
      setActionLoading(userId); // Start row loading

      const res = await api.put(
        `api/students/active-inactive/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Status updated:", res.data);

      // Update UI instantly
      setStudents((prev) =>
        prev.map((student) =>
          student.user_id === userId
            ? {
                ...student,
                User: {
                  ...student.User,
                  status: res.data.status,
                },
              }
            : student
        )
      );
    } catch (err) {
      console.error(
        "Error updating status:",
        err.response?.data || err.message
      );
    } finally {
      setActionLoading(null); // Stop row loading
    }
  };

  return (
    <div>
      <ManageUserTemplateAdmin
        user="Student"
        desc="View, edit, and manage student records"
        searchDesc="Search by name or roll no.."
        addLink="/admin/dashboard/AddStudentAdmin"
      >
        <table className="w-full border table-wrapper border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              {/* Sticky Enrollment No Column */}
              <th className="table-row-style font-semibold sticky-col">
                Enrollment No
              </th>

              <th className="table-row-style font-semibold">Name</th>
              <th className="table-row-style font-semibold">Year</th>
              <th className="table-row-style font-semibold">Email</th>
              <th className="table-row-style font-semibold">Status</th>
              <th className="table-row-style font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="table-row-style text-center">
                  <div className="flex justify-center items-center gap-2">
                    <div className="animate-spin h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                    Loading students...
                  </div>
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan="6" className="table-row-style text-center">
                  No students found.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-[var(--bg-hover)] transition"
                >
                  {/* Sticky Student ID */}
                  <td className="table-row-style sticky-col">
                    {student.student_id}
                  </td>

                  <td className="table-row-style">
                    {student.name}
                  </td>

                  <td className="table-row-style">
                    {student.year_of_study}
                  </td>

                  <td className="table-row-style break-words">
                    {student.email}
                  </td>

                  {/* Show current status */}
                  <td className="table-row-style">
                    {student.User?.status === "active" ? (
                      <span className="text-green-600 font-semibold">
                        Active
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Inactive
                      </span>
                    )}
                  </td>

                  {/* ✅ FIXED ACTION COLUMN (no flex on td) */}
                  <td className="table-row-style">
                    <div className="flex flex-wrap gap-2 items-center h-full">
                      <EditButton
                        disabled={actionLoading === student.id}
                        onClick={() =>
                          navigate(
                            `/admin/Dashboard/EditStudentAdmin/${student.id}`
                          )
                        }
                      />

                      <ActivateDeactivateButton
                        status={student.User?.status}
                        disabled={actionLoading === student.user_id}
                        onClick={() =>
                          toggleStudentStatus(student.user_id)
                        }
                      />

                      <DeleteButton
                        disabled={actionLoading === student.id}
                        onClick={() => deleteStudent(student.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </ManageUserTemplateAdmin>
    </div>
  );
};

export default ManageStudentAdmin;