import React, { useEffect, useState } from "react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import AddButton from "../../ui/Buttons/AddButton";
import CancelButton from "../../ui/Buttons/CancelButton";
import api from "../../api/axios";

import { Pencil, Trash2, BookOpen, X } from "lucide-react";

const UpdateSessionPlanningFaculty = () => {
  // ---------------- STATES ----------------

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  const [sessionPlans, setSessionPlans] = useState([]);

  const [editingPlan, setEditingPlan] = useState(null);

  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState("");

  const [lectureNo, setLectureNo] = useState("");
  const [date, setDate] = useState("");

  // ---------------- FETCH FACULTY CLASSES ----------------

  useEffect(() => {
    fetchTeachingInfo();
    fetchAllPlans();
  }, []);

  //   const fetchTeachingInfo = async () => {
  //     try {
  //       const res = await api.get("/api/session-planning/teaching-info");

  //       const classList = res.data.data.teaching_info.map((item) => item.class);

  //       setClasses(classList);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  const fetchTeachingInfo = async () => {
    // Dummy class data for testing UI
    const dummyClasses = [
      {
        class_pk: 1,
        class_id: "CS-A",
        semester: 3,
      },
      {
        class_pk: 2,
        class_id: "CS-B",
        semester: 3,
      },
      {
        class_pk: 3,
        class_id: "ME-A",
        semester: 5,
      },
      {
        class_pk: 4,
        class_id: "EC-A",
        semester: 4,
      },
    ];

    setClasses(dummyClasses);
  };

  // ---------------- FETCH ALL SESSION PLANS ----------------

  //   const fetchAllPlans = async () => {
  //     try {
  //       const res = await api.get("/api/session-planning/all");

  //       setSessionPlans(res.data.data.plans);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  const fetchAllPlans = async () => {
    const dummyPlans = [
      {
        plan_id: 1,
        class_id: "CS-A",
        subject_name: "Data Structures",
        lecture_no: 1,
        date: "2026-02-01",
        topics: ["Introduction to Data Structures", "Types of Data Structures"],
      },
      {
        plan_id: 2,
        class_id: "CS-A",
        subject_name: "Data Structures",
        lecture_no: 2,
        date: "2026-02-03",
        topics: ["Arrays", "Array Operations"],
      },
      {
        plan_id: 3,
        class_id: "CS-A",
        subject_name: "Data Structures",
        lecture_no: 3,
        date: "2026-02-05",
        topics: ["Linked List Introduction", "Types of Linked Lists"],
      },
      {
        plan_id: 4,
        class_id: "CS-A",
        subject_name: "Data Structures",
        lecture_no: 4,
        date: "2026-02-07",
        topics: ["Stack Introduction", "Stack Operations (Push & Pop)"],
      },
      {
        plan_id: 5,
        class_id: "CS-A",
        subject_name: "Data Structures",
        lecture_no: 5,
        date: "2026-02-09",
        topics: ["Queue Introduction", "Types of Queues"],
      },
    ];

    setSessionPlans(dummyPlans);
  };

  // ---------------- FILTER PLANS FOR SELECTED CLASS ----------------

  const filteredPlans = sessionPlans.filter(
    (plan) => plan.class_id === selectedClass?.class_id,
  );

  // ---------------- START EDITING ----------------

  const handleEdit = (plan) => {
    setEditingPlan(plan);

    setLectureNo(plan.lecture_no);

    setDate(plan.date.split("T")[0]);

    // topics come as array
    setTopics(plan.topics || []);
  };

  // ---------------- ADD TOPIC ----------------

  const handleAddTopic = () => {
    if (!newTopic.trim()) return;

    setTopics([...topics, newTopic]);

    setNewTopic("");
  };

  // ---------------- DELETE TOPIC ----------------

  const handleDeleteTopic = (index) => {
    const updated = topics.filter((_, i) => i !== index);

    setTopics(updated);
  };

  // ---------------- SAVE EDIT ----------------

  const handleSave = async () => {
    try {
      await api.put(`/api/session-planning/${editingPlan.plan_id}`, {
        topics,
        lecture_no: lectureNo,
        date,
      });

      alert("Session plan updated");

      setEditingPlan(null);

      fetchAllPlans();
    } catch (error) {
      alert("Update failed");

      console.log(error);
    }
  };

  // ---------------- DELETE PLAN ----------------

  const handleDeletePlan = async (plan_id) => {
    if (!window.confirm("Delete this session plan?")) return;

    try {
      await api.delete(`/api/session-planning/${plan_id}`);

      alert("Plan deleted");

      fetchAllPlans();
    } catch (error) {
      alert("Delete failed");

      console.log(error);
    }
  };

  return (
    <DashboardChildPageTemplate
      title="Update Session Planning"
      desc="View and update existing session plans for your classes"
    >
      {/* ---------- SELECT CLASS CARD ---------- */}

      <DashboardChildPageCard>
        <h3 className="text-[var(--text-primary)] font-medium mb-3">
          Select Class to View Session Plans
        </h3>

        <div className="flex flex-wrap gap-3">
          {classes.map((cls) => (
            <button
              key={cls.class_pk}
              onClick={() => setSelectedClass(cls)}
              className={`px-5 py-2 rounded-lg border transition
  ${
    selectedClass?.class_pk === cls.class_pk
      ? "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] border-[var(--btn-primary-bg)]"
      : "bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--border-medium)] hover:bg-[var(--bg-hover)]"
  }`}
            >
              {cls.class_id} Semester {cls.semester}
            </button>
          ))}
        </div>
      </DashboardChildPageCard>

      {/* ---------- SESSION PLANS ---------- */}

      {selectedClass && (
        <DashboardChildPageCard className="mt-4">
          {filteredPlans.length === 0 ? (
            <p className="text-[var(--text-muted)]">
              No session plans available
            </p>
          ) : (
            filteredPlans.map((plan) => (
              <div
                key={plan.plan_id}
                className="border border-[var(--border-light)] p-4 rounded-lg mb-4"
              >
                {/* HEADER */}

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)]">
                      {plan.subject_name}

                      <span className="ml-3 text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                        Lecture #{plan.lecture_no}
                      </span>
                    </h3>

                    <p className="text-sm text-[var(--text-muted)]">
                      {new Date(plan.date).toDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded-md flex items-center gap-1"
                      onClick={() => handleEdit(plan)}
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded-md flex items-center gap-1"
                      onClick={() => handleDeletePlan(plan.plan_id)}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>

                {/* TOPICS */}

                <div className="mt-3 bg-[var(--bg-secondary)] border border-[var(--border-light)] p-3 rounded-lg">
                  <p className="font-medium mb-2 text-[var(--text-primary)]">
                    Topics Covered
                  </p>

                  <ul className="space-y-1">
                    {plan.topics?.map((topic, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-[var(--text-secondary)]"
                      >
                        <BookOpen size={16} color="var(--icon-color)" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
        </DashboardChildPageCard>
      )}

      {/* ---------- EDIT FORM ---------- */}

      {editingPlan && (
        <DashboardChildPageCard className="mt-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-[var(--text-primary)]">
              Editing Session Plan
            </h3>

            <button
              onClick={() => setEditingPlan(null)}
              className="p-2 rounded-md text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition"
            >
              <X size={18} color="var(--icon-color)" />
            </button>
          </div>

          {/* LECTURE NO */}

          <div className="form-field">
            <label className="custom-label">Lecture Number</label>

            <input
              type="number"
              className="custom-input"
              value={lectureNo}
              onChange={(e) => setLectureNo(e.target.value)}
            />
          </div>

          {/* DATE */}

          <div className="form-field">
            <label className="custom-label">Date</label>

            <input
              type="date"
              className="custom-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* TOPIC INPUT */}

          <div className="form-field">
            <label className="custom-label">Topics</label>

            <div className="flex gap-2">
              <input
                type="text"
                className="custom-input"
                placeholder="Enter topic name"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
              />

              <button
                className="px-4 bg-blue-600 text-white rounded-md"
                onClick={handleAddTopic}
              >
                Add
              </button>
            </div>
          </div>

          {/* TOPIC LIST */}

          <div className="mt-3 space-y-2">
            {topics.map((topic, index) => (
              <div
                key={index}
                className="flex justify-between items-center 
  bg-[var(--bg-secondary)] 
  border border-[var(--border-light)]
  p-2 rounded-md"
              >
                <span className="text-[var(--text-secondary)]">
                  {index + 1}. {topic}
                </span>

                <button
                  onClick={() => handleDeleteTopic(index)}
                  className="p-1 rounded-md text-[var(--error-text)] hover:bg-[var(--bg-error-hover)] transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* ACTION BUTTONS */}

          <div className="form-actions">
            <CancelButton onClick={() => setEditingPlan(null)} />

            <button
              className="px-4 py-2 rounded-md transition 
  bg-[var(--btn-primary-bg)] 
  text-[var(--btn-primary-text)] 
  hover:bg-[var(--btn-primary-hover)]"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        </DashboardChildPageCard>
      )}
    </DashboardChildPageTemplate>
  );
};

export default UpdateSessionPlanningFaculty;
