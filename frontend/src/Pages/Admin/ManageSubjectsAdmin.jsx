import React, { useEffect, useState } from "react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import EditButton from "../../ui/Buttons/EditButton";

const ManageSubjectsAdmin = () => {
  const [subjects, setSubjects] = useState([]); // store all subjects
  const [activeSemester, setActiveSemester] = useState(1); // currently selected semester
  const navigate = useNavigate();


  // Fetch all subjects from backend
  useEffect(() => {
    api
      .get("/api/subjects")
      .then((res) => {
        setSubjects(res.data.subjects);
      })
      .catch((err) => {
        console.error(
          "Error Fetching Subjects:",
          err.response?.data || err.message
        );
      });
  }, []);

  // Filter subjects based on selected semester
  const filteredSubjects = subjects.filter(
    (sub) => sub.semester === activeSemester
  );

  return (
    <DashboardChildPageTemplate
      title="Manage Subjects"
      desc="View and Edit Subject Details"
      width="max-w-7xl"
    >
      <DashboardChildPageCard>

        {/* ---------- Semester Tabs ---------- */}
        <div className="flex flex-wrap gap-3 mb-6">
          {[1, 2, 3, 4, 5, 6].map((sem) => (
            <button
              key={sem}
              onClick={() => setActiveSemester(sem)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition 
                ${
                  activeSemester === sem
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-[var(--bg-hover)] text-[var(--text-secondary)] border-[var(--border-light)]"
                }`}
            >
              Semester {sem}
            </button>
          ))}
        </div>

        {/* ---------- Subject Cards ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredSubjects.length === 0 ? (
            <p className="text-[var(--text-muted)]">
              No subjects available for this semester.
            </p>
          ) : (
            filteredSubjects.map((subject) => (
              <div
                key={subject.subject_id}
                className="border border-[var(--border-light)] 
                           bg-[var(--card-bg)] 
                           rounded-xl p-5 shadow-sm 
                           hover:bg-[var(--bg-hover)] transition"
              >
                {/* Subject Title + Edit Button */}
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    {subject.subject_name}
                  </h3>

                  {/* Edit Button */}
                  <div
                    onClick={() =>
                      navigate(
                        `/admin/Dashboard/EditSubjectAdmin/${subject.subject_id}`
                      )
                    }
                    className="cursor-pointer"
                  >
                    <EditButton />
                  </div>
                </div>

                <hr className="mb-3 border-[var(--border-light)]" />

                {/* Subject Details */}
                <div className="text-sm space-y-2 text-[var(--text-secondary)]">
                  <div className="flex justify-between">
                    <span>Semester</span>
                    <span>Semester {subject.semester}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Lectures/Week</span>
                    <span>{subject.lecture_per_week}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Credit</span>
                    <span>{subject.credit}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  );
};

export default ManageSubjectsAdmin;