import React from "react";
import ManageUserTemplateAdmin from "../../ui/Templates/ManageUserTemplateAdmin";
import EditButton from "../../ui/Buttons/EditButton";
import { useState, useEffect } from "react";
import api from "../../api/axios.js";

const ManageStudentAdmin = () => {
  const token = localStorage.getItem("token"); // Get token from localStorage
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     api.get("api/students/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      setStudents(res.data); // backend sends array
      setLoading(false);
      console.log("Fetched student:", res.data);
    })
    .catch((err) => {
      setLoading(false);
      console.error(
        "Error fetching students:",
        err.response?.data || err.message
      );
    });
  },[]);

  return (
    <div>
      <ManageUserTemplateAdmin
        user="Student"
        desc="View, edit, and manage student records"
        searchDesc="Search by name or roll no.."
      >
        <table className="theme-transition w-full border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
          <thead className="theme-transition bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="table-row-style font-semibold">Roll No</th>
              <th className="table-row-style font-semibold">Name</th>
              <th className="table-row-style font-semibold">Class</th>
              <th className="table-row-style font-semibold">Year</th>
              <th className="table-row-style font-semibold">Email</th>
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
  ) : students.length === 0 ? (
    <tr className="hover:bg-gray-200 dark:hover:bg-gray-900 transition">
      <td colSpan="5" className="table-row-style text-center">
        No faculties found.
      </td>
    </tr>
  ) : (
    students.map((student) => (
      <tr
        key={student.faculty_id}
        className="hover:bg-gray-200 dark:hover:bg-gray-900 transition"
      >
        <td className="table-row-style">{student.student_id}</td>
        <td className="table-row-style">{student.name}</td>
        <td className="table-row-style">{student.class_id}</td>
        <td className="table-row-style">{student.year_of_study}</td>
        <td className="table-row-style">{student.email}</td>
        <td className="table-row-style">
          <button className="px-3 py-1 rounded bg-black text-white">
            Edit
          </button>
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
