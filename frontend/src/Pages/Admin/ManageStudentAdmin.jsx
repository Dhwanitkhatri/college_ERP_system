import React from "react";
import ManageUserTemplateAdmin from "../../ui/Templates/ManageUserTemplateAdmin";
import EditButton from "../../ui/Buttons/EditButton";

const ManageStudentAdmin = () => {
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
              <th className="table-row-style font-semibold">Course</th>
              <th className="table-row-style font-semibold">Semester</th>
              <th className="table-row-style font-semibold">Email</th>
              <th className="table-row-style font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr className="hover:bg-gray-200 dark:hover:bg-gray-900 transition">
              <td className="table-row-style">23BCA011</td>
              <td className="table-row-style">Jane Hopper</td>
              <td className="table-row-style">BCA</td>
              <td className="table-row-style">6</td>
              <td className="table-row-style">eleven11@gmail.com</td>
              <td className="table-row-style">
                <EditButton />
              </td>
            </tr>
            <tr className="hover:bg-gray-200 dark:hover:bg-gray-900 transition">
              <td className="table-row-style">23BCA011</td>
              <td className="table-row-style">Jane Hopper</td>
              <td className="table-row-style">BCA</td>
              <td className="table-row-style">6</td>
              <td className="table-row-style">eleven11@gmail.com</td>
              <td className="table-row-style">
                <EditButton />
              </td>
            </tr>
            <tr className="hover:bg-gray-200 dark:hover:bg-gray-900 transition">
              <td className="table-row-style">23BCA011</td>
              <td className="table-row-style">Jane Hopper</td>
              <td className="table-row-style">BCA</td>
              <td className="table-row-style">6</td>
              <td className="table-row-style">eleven11@gmail.com</td>
              <td className="table-row-style">
                <EditButton />
              </td>
            </tr>
            <tr className="hover:bg-gray-200 dark:hover:bg-gray-900 transition">
              <td className="table-row-style">23BCA011</td>
              <td className="table-row-style">Jane Hopper</td>
              <td className="table-row-style">BCA</td>
              <td className="table-row-style">6</td>
              <td className="table-row-style">eleven11@gmail.com</td>
              <td className="table-row-style">
                <EditButton />
              </td>
            </tr>
          </tbody>
        </table>
      </ManageUserTemplateAdmin>
    </div>
  );
};

export default ManageStudentAdmin;
