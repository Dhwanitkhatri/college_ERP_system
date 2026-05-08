import React, { useEffect, useState } from "react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import api from "../../api/axios";

const FeedbackEvaluationAdmin = () => {
  // ---------------------------
  // Local States
  // ---------------------------
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");



  // ---------------------------
  // Fetch Pending Feedbacks
  // ---------------------------
  const fetchPendingFeedbacks = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/api/feedback/pending");

      setFeedbacks(response.data);
    } catch (err) {
      setError("Failed to fetch feedbacks");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Accept Feedback
  // ---------------------------
  const handleAccept = async (id) => {
    try {
      await api.put(
        `/api/feedback/accept/${id}`);

      // Remove accepted feedback from list
      setFeedbacks((prev) => prev.filter((fb) => fb.id !== id));
    } catch (error) {
      alert("Error accepting feedback");
    }
  };

  // ---------------------------
  // Reject Feedback
  // ---------------------------
  const handleReject = async (id) => {
    try {
      await api.put(
        `/api/feedback/reject/${id}`);

      // Remove rejected feedback from list
      setFeedbacks((prev) => prev.filter((fb) => fb.id !== id));
    } catch (error) {
      alert("Error rejecting feedback");
    }
  };

  // ---------------------------
  // Load Data on Page Load
  // ---------------------------
  useEffect(() => {
    fetchPendingFeedbacks();
  }, []);

  return (
    <DashboardChildPageTemplate
      title="Feedback Evaluation"
      desc="Review and approve student feedback before publishing to faculty"
    >
      <DashboardChildPageCard>
        {loading && <p className="text-sm">Loading feedbacks...</p>}
        {error && <p className="custom-error">{error}</p>}

        {!loading && feedbacks.length === 0 && (
          <p className="text-sm text-[var(--text-muted)]">
            No pending feedback available.
          </p>
        )}

        {!loading && feedbacks.length > 0 && (
          <div className="table-wrapper mt-4">
            <table className="min-w-full border-collapse">
              <thead className="sticky-header">
                <tr>
                  <th className="table-row-style sticky-col">Student</th>
                  <th className="table-row-style">Faculty</th>
                  <th className="table-row-style">Rating</th>
                  <th className="table-row-style">Comments</th>
                  <th className="table-row-style">Date</th>
                  <th className="table-row-style text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {feedbacks.map((fb) => (
                  <tr key={fb.id} className="hover:bg-[var(--bg-hover)]">
                    
                    {/* Student Name */}
                    <td className="table-row-style sticky-col">
                      {fb.student_name || fb.student_id}
                    </td>

                    {/* Faculty Name */}
                    <td className="table-row-style">
                      {fb.faculty_name || fb.faculty_id}
                    </td>

                    {/* Rating */}
                    <td className="table-row-style">
                      ⭐ {fb.rating}
                    </td>

                    {/* Comments */}
                    <td className="table-row-style max-w-xs truncate">
                      {fb.comments}
                    </td>

                    {/* Date */}
                    <td className="table-row-style">
                      {new Date(fb.date_submitted).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="table-row-style text-center">
                      <div className="flex justify-center gap-3">
                        
                        {/* Accept Button */}
                        <button
                          onClick={() => handleAccept(fb.id)}
                          className="
                            px-3 py-1.5
                            text-sm
                            rounded-md
                            bg-green-600
                            text-white
                            hover:bg-green-700
                            transition-colors
                          "
                        >
                          Accept
                        </button>

                        {/* Reject Button */}
                        <button
                          onClick={() => handleReject(fb.id)}
                          className="
                            px-3 py-1.5
                            text-sm
                            rounded-md
                            bg-red-600
                            text-white
                            hover:bg-red-700
                            transition-colors
                          "
                        >
                          Reject
                        </button>

                      </div>
                    </td>

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

export default FeedbackEvaluationAdmin;