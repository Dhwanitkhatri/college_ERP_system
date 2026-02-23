import React, { useEffect, useState } from "react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import api from "../../api/axios";

const ViewFeedbackFaculty = () => {

  // ---------------------------
  // Local States
  // ---------------------------
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // ---------------------------
  // Fetch Accepted Feedbacks
  // ---------------------------
  const fetchAcceptedFeedbacks = async () => {
    try {
      setLoading(true);
      setError("");

      // Get faculty id from token (or localStorage)
      

      const response = await api.get(
        `/api/feedback/accepted`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFeedbacks(response.data.data);

    } catch (err) {
      setError("Failed to fetch feedback");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Load Data on Component Mount
  // ---------------------------
  useEffect(() => {
    fetchAcceptedFeedbacks();
  }, []);

  return (
    <DashboardChildPageTemplate
      title="View Feedback"
      desc="Here you can see approved anonymous feedback submitted by students"
    >
      <DashboardChildPageCard>

        {/* Loading State */}
        {loading && (
          <p className="text-sm text-[var(--text-muted)]">
            Loading feedback...
          </p>
        )}

        {/* Error State */}
        {error && (
          <p className="custom-error">{error}</p>
        )}

        {/* Empty State */}
        {!loading && feedbacks.length === 0 && (
          <p className="text-sm text-[var(--text-muted)]">
            No approved feedback available.
          </p>
        )}

        {/* Feedback Table */}
        {!loading && feedbacks.length > 0 && (
          <div className="table-wrapper mt-4">
            <table className="min-w-full border-collapse">
              
              <thead className="sticky-header">
                <tr>
                  <th className="table-row-style sticky-col">Rating</th>
                  <th className="table-row-style">Comments</th>
                  <th className="table-row-style">Submitted On</th>
                </tr>
              </thead>

              <tbody>
                {feedbacks.map((fb) => (
                  <tr key={fb.id} className="hover:bg-[var(--bg-hover)]">

                    {/* Rating Column */}
                    <td className="table-row-style sticky-col">
                      ⭐ {fb.rating} / 5
                    </td>

                    {/* Comments Column */}
                    <td className="table-row-style max-w-xl break-words">
                      {fb.comments}
                    </td>

                    {/* Date Column */}
                    <td className="table-row-style">
                      {new Date(fb.date_submitted).toLocaleDateString()}
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

export default ViewFeedbackFaculty;