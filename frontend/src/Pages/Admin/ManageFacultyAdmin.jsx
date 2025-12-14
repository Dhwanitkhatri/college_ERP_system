import React from "react";
import ManageUserTemplateAdmin from "../../ui/Templates/ManageUserTemplateAdmin";
import { useState, useEffect } from "react";
import api from "../../api/axios.js";
import EditButton from "../../ui/Buttons/EditButton.jsx";
import DeleteButton from "../../ui/Buttons/DeleteButton.jsx";

const ManageFacultyAdmin = () => {
  const token = localStorage.getItem("token"); // Get token from localStorage
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     api.get("api/faculties/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      setFaculties(res.data); // backend sends array
      setLoading(false);
      console.log("Fetched faculties:", res.data);
    })
    .catch((err) => {
      setLoading(false);
      console.error(
        "Error fetching faculties:",
        err.response?.data || err.message
      );
    });
  },[]);

  return (
    <div>
      <ManageUserTemplateAdmin
        user="Faculty"
        desc="View, edit, and manage faculty members"
        searchDesc="Search by name or department.."
      >
        <table className="w-full border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="table-row-style font-semibold">Name</th>
              <th className="table-row-style font-semibold">Faculty Id</th>
              <th className="table-row-style font-semibold">Email</th>
              <th className="table-row-style font-semibold">Phone</th>
              <th className="table-row-style font-semibold">Actions</th>
            </tr>
          </thead>

         <tbody>
  {loading ? (
    <tr className="hover:bg-gray-200 dark:hover:bg-gray-900 transition">
      <td colSpan="5" className="table-row-style text-center">
        Loading...
      </td>
    </tr>
  ) : faculties.length === 0 ? (
    <tr className="hover:bg-gray-200 dark:hover:bg-gray-900 transition">
      <td colSpan="5" className="table-row-style text-center">
        No faculties found.
      </td>
    </tr>
  ) : (
    faculties.map((faculty) => (
      <tr
        key={faculty.faculty_id}
        className="hover:bg-gray-200 dark:hover:bg-gray-900 transition"
      >
        <td className="table-row-style">{faculty.name}</td>
        <td className="table-row-style">{faculty.faculty_id}</td>
        <td className="table-row-style">{faculty.email}</td>
        <td className="table-row-style">{faculty.phone}</td>
        <td className="table-row-style"><EditButton/> </td>
        <td className="table-row-style"> <DeleteButton/></td>
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
