import React, { useEffect, useState } from "react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import { getUserRole } from "../../utils/auth";
import api from "../../api/axios";

const ViewSessionPlanFaculty = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [sessionPlan, setSessionPlan] = useState([]);
  const [loading, setLoading] = useState(false);

  const userRole = getUserRole();

  // ---------------- FETCH SUBJECTS ----------------
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get(
          "/api/session/get-facultysubject"
        );

        setSubjects(res.data.data || []);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setSubjects([]);
      }
    };

    fetchSubjects();
  }, []);

  // ---------------- SUBJECT CHANGE ----------------
  const handleSubjectChange = async (e) => {
    const subjectId = e.target.value;
    setSelectedSubject(subjectId);

    if (!subjectId) {
      setSessionPlan([]);
      return;
    }

    try {
      setLoading(true);

      const res = await api.get(
        `/api/session/session-plan/${subjectId}`
      );

      setSessionPlan(res.data.data || res.data || []);
    } catch (error) {
      console.error("Error fetching session plan:", error);
      setSessionPlan([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- TOGGLE STATUS ----------------
  const handleMarkComplete = async (index) => {
    const updatedPlan = [...sessionPlan];
    const session = updatedPlan[index];

    const newStatus =
      session.status === "Completed" ? "Pending" : "Completed";

    try {
      await api.put(
        `/api/session/session-plan/status/${session.id}`,
        {
          status: newStatus,
        }
      );

      updatedPlan[index].status = newStatus;
      setSessionPlan(updatedPlan);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <DashboardChildPageTemplate
      title="View Session Plan"
      desc="Select a subject to view its session plan"
    >
      {/* ---------------- SUBJECT SELECT ---------------- */}
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

      {/* ---------------- SESSION PLAN ---------------- */}
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

                  {userRole === "Faculty" && (
                    <th className="table-row-style">Action</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {sessionPlan.map((session, index) => (
                  <tr
                    key={session.id}
                    className="hover:bg-[var(--bg-hover)] transition"
                  >
                    <td className="table-row-style">
                      {session.session_no}
                    </td>
                    <td className="table-row-style">{session.topic}</td>
                    <td className="table-row-style">
                      {session.planned_date}
                    </td>
                    <td className="table-row-style">
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
