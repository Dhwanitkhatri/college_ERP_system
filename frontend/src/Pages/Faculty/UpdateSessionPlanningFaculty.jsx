import React, { useEffect, useState } from "react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import CancelButton from "../../ui/Buttons/CancelButton";
import api from "../../api/axios";

import { Pencil, Trash2, BookOpen, X } from "lucide-react";

const UpdateSessionPlanningFaculty = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [sessionPlans, setSessionPlans] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);

  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState("");
  const [lectureNo, setLectureNo] = useState("");
  const [date, setDate] = useState("");

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
    }
  };

  // ---------- API: ALL PLANS ----------
  const fetchAllPlans = async () => {
    try {
      const res = await api.get("/api/session/all");
      console.log(res.data)
      setSessionPlans(res.data?.data?.plans || []);
    } catch (error) {
      console.log(error);
    }
  };

  // ---------- FILTER ----------
  const filteredPlans = sessionPlans.filter(
    (plan) => plan.class_id === selectedClass?.class_id
  );

  // ---------- EDIT ----------
  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setLectureNo(plan.lecture_no);
    setDate(plan.date ? plan.date.substring(0, 10) : "");

    // FIX: convert string → array
    setTopics(
      plan.topics
        ? plan.topics.split(",").map((t) => t.trim())
        : []
    );
  };

  // ---------- ADD TOPIC ----------
  const handleAddTopic = () => {
    if (!newTopic.trim()) return;

    if (topics.includes(newTopic)) {
      alert("Topic already exists");
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
      alert("Please fill all fields");
      return;
    }

    try {
      await api.put(`/api/session/${editingPlan.plan_id}`, {
        // FIX: array → string
        topics: topics.join(", "),
        lecture_no: Number(lectureNo),
        date,
      });

      alert("Session plan updated");

      setEditingPlan(null);
      fetchAllPlans();
    } catch (error) {
      console.log(error);
      alert("Update failed");
    }
  };

  // ---------- DELETE ----------
  const handleDeletePlan = async (plan_id) => {
    if (!window.confirm("Delete this session plan?")) return;

    try {
      await api.delete(`/api/session/${plan_id}`);

      alert("Plan deleted");
      fetchAllPlans();
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  return (
    <DashboardChildPageTemplate
      title="Update Session Planning"
      desc="View and update existing session plans for your classes"
    >
      {/* ---------- CLASS SELECT ---------- */}
      <DashboardChildPageCard>
        <h3 className="mb-3">Select Class</h3>

        <div className="flex flex-wrap gap-3">
          {classes.map((cls) => (
            <button
              key={cls.class_pk}
              onClick={() => setSelectedClass(cls)}
              className={`px-5 py-2 rounded-lg border ${
                selectedClass?.class_pk === cls.class_pk
                  ? "bg-blue-600 text-white"
                  : "bg-white"
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
            <p>No session plans</p>
          ) : (
            filteredPlans.map((plan) => (
              <div key={plan.plan_id} className="border p-4 rounded mb-4">
                <div className="flex justify-between">
                  <div>
                    <h3>{plan.subject_name}</h3>
                    <p>Lecture #{plan.lecture_no}</p>
                    <p>{new Date(plan.date).toDateString()}</p>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(plan)}>
                      <Pencil size={16} /> Edit
                    </button>

                    <button onClick={() => handleDeletePlan(plan.plan_id)}>
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>

                {/* FIX: topics as string → array */}
                <div className="mt-3">
                  {(plan.topics || "")
                    .split(",")
                    .map((t) => t.trim())
                    .filter((t) => t)
                    .map((t, i) => (
                      <div key={i}>
                        <BookOpen size={14} /> {t}
                      </div>
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
          <div className="flex justify-between">
            <h3>Edit Plan</h3>

            <button onClick={() => setEditingPlan(null)}>
              <X />
            </button>
          </div>

          <input
            type="number"
            value={lectureNo}
            onChange={(e) => setLectureNo(e.target.value)}
            placeholder="Lecture No"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <div className="flex gap-2">
            <input
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Add topic"
            />

            <button onClick={handleAddTopic}>Add</button>
          </div>

          {topics.map((topic, i) => (
            <div key={i}>
              {topic}
              <button onClick={() => handleDeleteTopic(i)}>X</button>
            </div>
          ))}

          <div className="flex gap-3 mt-4">
            <CancelButton onClick={() => setEditingPlan(null)} />

            <button onClick={handleSave}>Save Changes</button>
          </div>
        </DashboardChildPageCard>
      )}
    </DashboardChildPageTemplate>
  );
};

export default UpdateSessionPlanningFaculty;
