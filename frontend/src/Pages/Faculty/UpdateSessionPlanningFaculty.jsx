import React, { useEffect, useState } from "react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import CancelButton from "../../ui/Buttons/CancelButton";
import SaveButton from "../../ui/Buttons/SaveButton";
import api from "../../api/axios";

import { Pencil, Trash2, BookOpen, X } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import ConfirmDialog from "../../Components/ConfirmDialog";

const UpdateSessionPlanningFaculty = () => {
  const { showToast } = useToast();

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [sessionPlans, setSessionPlans] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);

  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState("");
  const [lectureNo, setLectureNo] = useState("");
  const [date, setDate] = useState("");

  const [deleteId, setDeleteId] = useState(null); // 🔥 confirm dialog

  useEffect(() => {
    fetchTeachingInfo();
    fetchAllPlans();
  }, []);

  // ---------- API: TEACHING INFO ----------
  const fetchTeachingInfo = async () => {
    try {
      const res = await api.get("/api/session/teaching-info");

      const classList =
        res.data?.data?.teaching_info?.map((item) => item.class) || [];

      setClasses(classList);
    } catch (error) {
      console.log(error);
      showToast("Error fetching classes", "error");
    }
  };

  // ---------- API: ALL PLANS ----------
  const fetchAllPlans = async () => {
    try {
      const res = await api.get("/api/session/all");
      setSessionPlans(res.data?.data?.plans || []);
    } catch (error) {
      console.log(error);
      showToast("Error fetching plans", "error");
    }
  };

  // ---------- FILTER ----------
  const filteredPlans = sessionPlans.filter(
    (plan) => plan.class_id === selectedClass?.class_id,
  );

  // ---------- EDIT ----------
  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setLectureNo(plan.lecture_no);
    setDate(plan.date ? plan.date.substring(0, 10) : "");

    setTopics(plan.topics ? plan.topics.split(",").map((t) => t.trim()) : []);
  };

  // ---------- ADD TOPIC ----------
  const handleAddTopic = () => {
    if (!newTopic.trim()) return;

    if (topics.includes(newTopic)) {
      showToast("Topic already exists", "error");
      return;
    }

    setTopics([...topics, newTopic]);
    setNewTopic("");
  };

  // ---------- DELETE TOPIC ----------
  const handleDeleteTopic = (index) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  // ---------- SAVE ----------
  const handleSave = async () => {
    if (!lectureNo || !date || topics.length === 0) {
      showToast("Please fill all fields", "error");
      return;
    }

    try {
      await api.put(`/api/session/${editingPlan.plan_id}`, {
        topics: topics.join(", "),
        lecture_no: Number(lectureNo),
        date,
      });

      showToast("Session plan updated", "success");

      setEditingPlan(null);
      fetchAllPlans();
    } catch (error) {
      console.log(error);
      showToast("Update failed", "error");
    }
  };

  // ---------- DELETE ----------
  const handleDeletePlan = async () => {
    try {
      await api.delete(`/api/session/${deleteId}`);

      showToast("Plan deleted", "success");
      setDeleteId(null);
      fetchAllPlans();
    } catch (error) {
      console.log(error);
      showToast("Delete failed", "error");
    }
  };

  return (
    <DashboardChildPageTemplate
      title="Update Session Planning"
      desc="View and update existing session plans for your classes"
    >
      {/* ---------- CLASS SELECT ---------- */}
      <DashboardChildPageCard>
        <h3 className="mb-3 text-[var(--text-primary)] font-semibold">
          Select Class
        </h3>

        <div className="flex flex-wrap gap-3">
          {classes.map((cls) => (
            <button
              key={cls.class_pk}
              onClick={() => setSelectedClass(cls)}
              className={`px-5 py-2 rounded-lg border transition 
                ${
                  selectedClass?.class_pk === cls.class_pk
                    ? "bg-[var(--btn-blue-bg)] text-white"
                    : "bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--border-light)] hover:bg-[var(--bg-hover)]"
                }`}
            >
              {cls.class_id} Sem {cls.semester}
            </button>
          ))}
        </div>
      </DashboardChildPageCard>

      {/* ---------- PLANS ---------- */}
      {selectedClass && (
        <DashboardChildPageCard className="mt-4">
          {filteredPlans.length === 0 ? (
            <p className="text-[var(--text-muted)]">No session plans</p>
          ) : (
            filteredPlans.map((plan) => (
              <div
                key={plan.plan_id}
                className="border border-[var(--border-light)] p-4 rounded-lg mb-4 bg-[var(--card-bg)]"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)]">
                      {plan.subject_name}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Lecture #{plan.lecture_no}
                    </p>
                    <p className="text-sm text-[var(--text-muted)]">
                      {new Date(plan.date).toDateString()}
                    </p>
                  </div>

                  {/* 🔥 BUTTON FIX */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(plan)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md 
                      bg-[var(--bg-hover)] hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <Pencil size={14} /> Edit
                    </button>

                    <button
                      onClick={() => setDeleteId(plan.plan_id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md 
                      bg-red-500 text-white hover:bg-red-600"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>

                {/* TOPICS */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {(plan.topics || "")
                    .split(",")
                    .map((t) => t.trim())
                    .filter((t) => t)
                    .map((t, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1 px-3 py-1 text-xs rounded-full 
                        bg-[var(--bg-hover)] text-[var(--text-secondary)]"
                      >
                        <BookOpen size={12} /> {t}
                      </span>
                    ))}
                </div>
              </div>
            ))
          )}
        </DashboardChildPageCard>
      )}

      {/* ---------- EDIT FORM ---------- */}
      {editingPlan && (
        <DashboardChildPageCard className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-[var(--text-primary)]">
              Edit Plan
            </h3>

            <button onClick={() => setEditingPlan(null)}>
              <X className="text-[var(--icon-color)]" />
            </button>
          </div>

          {/* INPUTS */}
          <div className="form-field">
            <input
              type="number"
              value={lectureNo}
              onChange={(e) => setLectureNo(e.target.value)}
              placeholder="Lecture No"
              className="custom-input"
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="custom-input"
            />
          </div>

          {/* ADD TOPIC */}
          <div className="flex gap-2 mt-2">
            <input
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Add topic"
              className="custom-input"
            />

            <button
              onClick={handleAddTopic}
              className="px-4 py-2 rounded-lg bg-[var(--btn-blue-bg)] text-white"
            >
              Add
            </button>
          </div>

          {/* TOPICS LIST */}
          <div className="mt-3 flex flex-wrap gap-2">
            {topics.map((topic, i) => (
              <span
                key={i}
                className="flex items-center gap-2 px-3 py-1 text-xs rounded-full 
                bg-[var(--bg-hover)]"
              >
                {topic}
                <button onClick={() => handleDeleteTopic(i)}>
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="form-actions">
            <CancelButton onClick={() => setEditingPlan(null)} />
            <SaveButton onClick={handleSave} />
          </div>
        </DashboardChildPageCard>
      )}

      {/* 🔥 CONFIRM DIALOG */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Session Plan"
        message="Are you sure you want to delete this plan?"
        onConfirm={handleDeletePlan}
        onCancel={() => setDeleteId(null)}
      />
    </DashboardChildPageTemplate>
  );
};

export default UpdateSessionPlanningFaculty;
