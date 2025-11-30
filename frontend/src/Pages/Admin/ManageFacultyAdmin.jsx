import React from "react";
import ManageUserTemplateAdmin from "../../ui/ManageUserTemplateAdmin";

const ManageFacultyAdmin = () => {
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
      <th className="table-row-style font-semibold">Department</th>
      <th className="table-row-style font-semibold">Email</th>
      <th className="table-row-style font-semibold">Phone</th>
      <th className="table-row-style font-semibold">Actions</th>
    </tr>
  </thead>

  <tbody>
    <tr className="hover:bg-gray-200 dark:hover:bg-gray-900 transition">
      <td className="table-row-style">Dr. Sarah Johnson</td>
      <td className="table-row-style">Computer Science</td>
      <td className="table-row-style">sarah.j@college.edu</td>
      <td className="table-row-style">9876543210</td>
      <td className="table-row-style">
        <button className="px-3 py-1 rounded bg-black text-white">
          Edit
        </button>
      </td>
    </tr>
    <tr className="hover:bg-gray-200 dark:hover:bg-gray-900 transition">
      <td className="table-row-style">Dr. Sarah Johnson</td>
      <td className="table-row-style">Computer Science</td>
      <td className="table-row-style">sarah.j@college.edu</td>
      <td className="table-row-style">9876543210</td>
      <td className="table-row-style">
        <button className="px-3 py-1 rounded bg-black text-white">
          Edit
        </button>
      </td>
    </tr>
    <tr className="hover:bg-gray-200 dark:hover:bg-gray-900 transition">
      <td className="table-row-style">Dr. Sarah Johnson</td>
      <td className="table-row-style">Computer Science</td>
      <td className="table-row-style">sarah.j@college.edu</td>
      <td className="table-row-style">9876543210</td>
      <td className="table-row-style">
        <button className="px-3 py-1 rounded bg-black text-white">
          Edit
        </button>
      </td>
    </tr>
    <tr className="hover:bg-gray-200 dark:hover:bg-gray-900 transition">
      <td className="table-row-style">Dr. Sarah Johnson</td>
      <td className="table-row-style">Computer Science</td>
      <td className="table-row-style">sarah.j@college.edu</td>
      <td className="table-row-style">9876543210</td>
      <td className="table-row-style">
        <button className="px-3 py-1 rounded bg-black text-white">
          Edit
        </button>
      </td>
    </tr>
  </tbody>
</table>
      </ManageUserTemplateAdmin>
    </div>
  );
};

export default ManageFacultyAdmin;
