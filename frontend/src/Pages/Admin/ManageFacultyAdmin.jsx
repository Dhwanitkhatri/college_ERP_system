import React, { useState, useEffect } from "react";
import ManageUserTemplateAdmin from "../../ui/Templates/ManageUserTemplateAdmin";
import api from "../../api/axios.js";
import EditButton from "../../ui/Buttons/EditButton.jsx";
import DeleteButton from "../../ui/Buttons/DeleteButton.jsx";
import { useNavigate } from "react-router-dom";
import ActivateDeactivateButton from "../../ui/Buttons/ActivateDeactivateButton.jsx";

const ManageFacultyAdmin = () => {
  const navigate = useNavigate(); // this is for navigating

  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true); // Page loading state
  const [actionLoading, setActionLoading] = useState(null); // Row action loading state
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const filteredFaculties = faculties.filter((faculty) => {
    // Filter faculties based on search term
    const term = searchTerm.toLowerCase();

    return (
      faculty.name?.toLowerCase().includes(term) ||
      faculty.email?.toLowerCase().includes(term) ||
      faculty.faculty_id?.toLowerCase().includes(term) ||
      faculty.phone?.toLowerCase().includes(term)
    );
  });

  // Fetch all faculties when component loads
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const res = await api.get("api/faculties/");

        setFaculties(res.data); // backend sends array
        console.log("Fetched faculties:", res.data);
      } catch (err) {
        console.error(
          "Error fetching faculties:",
          err.response?.data || err.message,
        );
      } finally {
        setLoading(false); // Stop loading after API completes
      }
    };

    fetchFaculties();
  }, []);

  /*
    This function toggles faculty active/inactive status.
    It sends PUT request to backend and updates UI instantly.
  */
  const toggleFacultyStatus = async (userId) => {
    if (!window.confirm("Are you sure you want to change status?")) return;

    try {
      setActionLoading(userId); // Start row loading

      const res = await api.put(`api/faculties/active-inactive/${userId}`, {});

      console.log("Status updated:", res.data);

      // Update UI instantly
      setFaculties((prev) =>
        prev.map((faculty) =>
          faculty.user_id === userId
            ? {
                ...faculty,
                User: {
                  ...faculty.User,
                  status: res.data.status,
                },
              }
            : faculty,
        ),
      );
    } catch (err) {
      console.error(
        "Error updating status:",
        err.response?.data || err.message,
      );
    } finally {
      setActionLoading(null); // Stop row loading
    }
  };

  /*
    This function deletes a faculty.
    It calls backend and removes faculty from UI state.
  */
  const deleteFaculty = async (facultyId) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this faculty?",
      )
    )
      return;

    try {
      setActionLoading(facultyId); // Start row loading

      await api.delete(`api/faculties/${facultyId}`, {});

      console.log("Faculty deleted successfully");

      // Remove from UI instantly (no reload)
      setFaculties((prev) =>
        prev.filter((faculty) => faculty.id !== facultyId),
      );
    } catch (err) {
      console.error(
        "Error deleting faculty:",
        err.response?.data || err.message,
      );
    } finally {
      setActionLoading(null); // Stop row loading
    }
  };

  return (
    <div>
      <ManageUserTemplateAdmin
        user="Faculty"
        desc="View, edit, and manage faculty members"
        searchDesc="Search by name or department.."
        addLink="/admin/dashboard/AddFacultyAdmin"
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      >
        <table className="w-full border table-wrapper border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="table-row-style font-semibold">Name</th>
              <th className="table-row-style font-semibold sticky-col">
                Faculty Id
              </th>
              <th className="table-row-style font-semibold">Email</th>
              <th className="table-row-style font-semibold">Phone</th>
              <th className="table-row-style font-semibold">Status</th>
              <th className="table-row-style font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {/* Page Loading State */}
            {loading ? (
              <tr>
                <td colSpan="6" className="table-row-style text-center">
                  <div className="flex justify-center items-center gap-2">
                    <div className="animate-spin h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                    Loading faculties...
                  </div>
                </td>
              </tr>
            ) : filteredFaculties.length === 0 ? (
              /* Empty State */
              <tr>
                <td colSpan="6" className="table-row-style text-center">
                  No results found for "{searchTerm}"
                </td>
              </tr>
            ) : (
              filteredFaculties.map((faculty) => (
                <tr
                  key={faculty.id}
                  className="hover:bg-[var(--bg-hover)] transition"
                >
                  <td className="table-row-style">{faculty.name}</td>

                  {/* Sticky Faculty ID Column */}
                  <td className="table-row-style sticky-col">
                    {faculty.faculty_id}
                  </td>

                  <td className="table-row-style">{faculty.email}</td>

                  {/* Phone Column (wraps naturally) */}
                  <td className="table-row-style break-words">
                    {faculty.phone}
                  </td>

                  {/* Show current status */}
                  <td className="table-row-style">
                    {faculty.User?.status === "active" ? (
                      <span className="text-green-600 font-semibold">
                        Active
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="table-row-style">
                    <div className="flex flex-wrap gap-2 items-center h-full">
                      <EditButton
                        onClick={() =>
                          navigate(
                            `/admin/Dashboard/EditFacultyAdmin/${faculty.id}`,
                          )
                        }
                        disabled={actionLoading === faculty.id}
                      />

                      <ActivateDeactivateButton
                        status={faculty.User?.status}
                        disabled={actionLoading === faculty.user_id}
                        onClick={() => toggleFacultyStatus(faculty.user_id)}
                      />

                      <DeleteButton
                        disabled={actionLoading === faculty.id}
                        onClick={() => deleteFaculty(faculty.id)}
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

export default ManageFacultyAdmin;
