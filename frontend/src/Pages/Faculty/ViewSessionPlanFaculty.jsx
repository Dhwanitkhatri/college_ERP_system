import React, { useEffect, useState } from "react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import { getUserRole } from "../../utils/auth";
// import api from "../../api/axios.js"; // 🔹 Uncomment when backend is ready

const ViewSessionPlanFaculty = () => {
  // ---------------- STATE ----------------
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [sessionPlan, setSessionPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const userRole = getUserRole();
  console.log("User Role This msg is from view sessionplan:", userRole);

  // ---------------- DUMMY DATA ----------------
  const dummySubjects = [
    { subject_id: 1, subject_name: "DBMS" },
    { subject_id: 2, subject_name: "Operating System" },
    { subject_id: 3, subject_name: "Computer Networks" },
  ];

  const dummySessionPlans = {
    1: [
      {
        id: 1,
        session_no: 1,
        topic: "Introduction to DBMS",
        planned_date: "2026-04-01",
        status: "Completed",
      },
      {
        id: 2,
        session_no: 2,
        topic: "ER Model",
        planned_date: "2026-04-03",
        status: "Completed",
      },
      {
        id: 3,
        session_no: 3,
        topic: "Normalization",
        planned_date: "2026-04-05",
        status: "Pending",
      },
    ],
    2: [
      {
        id: 4,
        session_no: 1,
        topic: "Introduction to OS",
        planned_date: "2026-04-02",
        status: "Completed",
      },
      {
        id: 5,
        session_no: 2,
        topic: "Process Scheduling",
        planned_date: "2026-04-04",
        status: "Pending",
      },
    ],
    3: [
      {
        id: 6,
        session_no: 1,
        topic: "Basics of Networking",
        planned_date: "2026-04-01",
        status: "Completed",
      },
      {
        id: 7,
        session_no: 2,
        topic: "OSI Model",
        planned_date: "2026-04-03",
        status: "Pending",
      },
    ],
  };

  // ---------------- LOAD SUBJECTS ----------------
  useEffect(() => {
    // 🔹 Using Dummy Data
    setSubjects(dummySubjects);

    // 🔹 BACKEND VERSION (Future)
    /*
    async function fetchSubjects() {
      const res = await api.get("/api/subjects");
      setSubjects(res.data);
    }
    fetchSubjects();
    */
  }, []);

  // ---------------- HANDLE SUBJECT CHANGE ----------------
  const handleSubjectChange = async (e) => {
    const subjectId = e.target.value;
    setSelectedSubject(subjectId);

    if (!subjectId) return;

    // 🔹 USING DUMMY DATA
    setLoading(true);
    setTimeout(() => {
      setSessionPlan(dummySessionPlans[subjectId] || []);
      setLoading(false);
    }, 500); // small delay to simulate API

    // 🔹 BACKEND VERSION (Future)
    /*
    try {
      setLoading(true);
      const res = await api.get(`/api/session-plan/${subjectId}`);
      setSessionPlan(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
    */
  };

  const handleMarkComplete = async (index) => {
    const updatedPlan = [...sessionPlan];

    // Toggle status
    updatedPlan[index].status =
      updatedPlan[index].status === "Completed" ? "Pending" : "Completed";

    setSessionPlan(updatedPlan);

    // 🔹 BACKEND CALL (Future)
    /*
  await api.put(`/api/session-plan/update/${updatedPlan[index].id}`, {
    status: updatedPlan[index].status,
  });
  */
  };

  return (
    <DashboardChildPageTemplate
      title="View Session Plan"
      desc="Select a subject to view its session plan"
    >
      {/* ---------------- SUBJECT SELECTION ---------------- */}
      <DashboardChildPageCard>
        <div className="form-field">
          <label className="custom-label">Select Subject</label>

          <select
            className="custom-input"
            value={selectedSubject}
            onChange={handleSubjectChange}
          >
            <option value="">-- Select Subject --</option>

            {subjects.map((sub) => (
              <option key={sub.subject_id} value={sub.subject_id}>
                {sub.subject_name}
              </option>
            ))}
          </select>
        </div>
      </DashboardChildPageCard>

      {/* ---------------- SESSION PLAN DISPLAY ---------------- */}
      <DashboardChildPageCard className="mt-3">
        {/* LOADING */}
        {loading && (
          <p className="text-sm text-[var(--text-muted)]">
            Loading session plan...
          </p>
        )}

        {/* NO SUBJECT */}
        {!selectedSubject && !loading && (
          <p className="text-sm text-[var(--text-muted)]">
            Please select a subject to view the session plan.
          </p>
        )}

        {/* NO DATA */}
        {selectedSubject && !loading && sessionPlan.length === 0 && (
          <p className="text-sm text-[var(--text-muted)]">
            No session plan available.
          </p>
        )}

        {/* TABLE */}
        {sessionPlan.length > 0 && !loading && (
          <div className="table-wrapper">
            <table className="min-w-full border border-[var(--border-light)]">
              <thead className="sticky-header">
                <tr>
                  <th className="table-row-style">Session No</th>
                  <th className="table-row-style">Topic</th>
                  <th className="table-row-style">Planned Date</th>
                  <th className="table-row-style">Status</th>
                  {userRole === "faculty" && (
                    <th className="table-row-style">Action</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {sessionPlan.map((session, index) => (
                  <tr
                    key={index}
                    className="hover:bg-[var(--bg-hover)] transition"
                  >
                    <td className="table-row-style">{session.session_no}</td>
                    <td className="table-row-style">{session.topic}</td>
                    <td className="table-row-style">{session.planned_date}</td>
                    <td className="table-row-style">
                      {/* BONUS: Status Styling */}
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          session.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {session.status}
                      </span>
                    </td>
                    {userRole === "Faculty" && (
                      <td className="table-row-style">
                        <input
                          type="checkbox"
                          checked={session.status === "Completed"}
                          onChange={() => handleMarkComplete(index)}
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  );
};

export default ViewSessionPlanFaculty;
