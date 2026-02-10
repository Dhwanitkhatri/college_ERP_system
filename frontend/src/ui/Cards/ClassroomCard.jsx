import React from "react";
import { Users, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ClassroomCard = ({ name, dept, students, mentor, id }) => {
  const navigate = useNavigate();
  const handleEdit = () => {
    console.log("Edit classroom ID:", id);
    navigate(`/admin/Dashboard/EditClassroomAdmin/${id}`)
  }
  return (
    <div className="wrapperDiv bg-[var(--card-bg)] border border-[var(--border-light)] rounded-xl p-6 shadow-sm hover:shadow-md theme-transition">
      <div className="headerDiv flex justify-between items-start mb-6">
        <div className="nameDiv">
          <p className="text-lg font-bold text-[var(--text-primary)]">
            {name}
          </p>
        </div>
        <p className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--bg-hover)] text-[var(--text-secondary)] border border-[var(--border-light)]">
          {dept}
        </p>
        <button
          className="text-sm px-3 py-1 rounded-md border border-blue-500 text-blue-600 hover:bg-blue-50 transition"
          onClick={handleEdit}
        >
          Edit
        </button>
      </div>
      <div className="componentDiv space-y-4">
        <div className="totalStudentsDiv flex items-center p-3 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-100 dark:border-blue-800">
          <div className="usersIconDiv p-2 bg-white dark:bg-blue-900 rounded-md shrink-0">
            <Users size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-xs font-medium text-blue-600 dark:text-blue-300 ">
              Total Students
            </p>
            <p className="text-lg font-semibold text-[var(--text-primary)]">
              {students}
            </p>
          </div>
        </div>
        <div className="mentorDiv flex items-center p-3 bg-green-50 dark:bg-green-900 rounded-lg border border-green-100 dark:border-green-800">
          <div className="userIconDiv bg-white dark:bg-green-900 rounded-md shrink-0">
            <User size={20} className="text-green-600 dark:text-green-400" />
          </div>
          <div className="ml-3">
            <p className="text-xs font-medium text-green-600 dark:text-green-300">
              Class Mentor
            </p>
            <p className="text-lg font-semibold text-[var(--text-primary)]">
              {mentor}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ClassroomCard;
