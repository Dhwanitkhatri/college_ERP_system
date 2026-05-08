import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import DashboardChildPageTemplate from "../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../ui/Cards/DashboardChildPageCard";
import { Calendar, FileText, ArrowLeft } from "lucide-react";
import api from "../api/axios.js";
import SaveButton from "../ui/Buttons/SaveButton";
import CancelButton from "../ui/Buttons/CancelButton";
import { getUserRole } from "../utils/auth";
import { useToast } from "../context/ToastContext"; // 🔥 toast

const formatTimetable = (data) => {
  const days = Object.keys(data);

  const timeSlots = [
    { start: "09:00:00", end: "09:55:00" },
    { start: "10:00:00", end: "10:55:00" },
    { start: "11:00:00", end: "11:55:00" },
    { start: "12:00:00", end: "12:55:00" },
    { start: "13:00:00", end: "13:55:00" },
    { start: "14:00:00", end: "14:55:00" },
  ];

  return days.map((day) => ({
    day,
    slots: timeSlots.map((slot) => {
      const lecture = (data[day] || []).find(
        (lec) => lec.start_time === slot.start && lec.end_time === slot.end,
      );

      return {
        id: lecture?.id || null,
        start: slot.start,
        end: slot.end,
        subject_id: lecture?.subject_id || "",
        faculty_id: lecture?.faculty_id || "",
        subject: lecture?.Subject?.subject_name || "",
        faculty: lecture?.Faculty?.name || "",
      };
    }),
  }));
};

export default function ViewTimetable() {
  /* ================= STATE ================= */
  const [activeTab, setActiveTab] = useState("menu");
  const [classes, setClasses] = useState([]);
  const [lectureData, setLectureData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  const role = getUserRole();
  const { showToast } = useToast(); // 🔥 toast

  const { register, watch, setValue } = useForm();
  const selectedClass = watch("selectedClass");

  /* ================= FETCH CLASSES ================= */
  useEffect(() => {
    api
      .get("api/timetables/current-year-classes")
      .then((res) => setClasses(res.data.data))
      .catch(() => showToast("Error fetching classes", "error"));
  }, []);

  /* ================= FETCH TIMETABLE ================= */
  useEffect(() => {
    if (!selectedClass) return;

    api
      .get(`api/timetables/class/${selectedClass}`)
      .then((res) => {
        const formatted = formatTimetable(res.data);
        setLectureData(formatted);
        setOriginalData(formatted);
      })
      .catch(() => showToast("Error fetching timetable", "error"));
  }, [selectedClass]);

  /* ================= FETCH SUBJECTS & FACULTY ================= */
  useEffect(() => {
    if (!selectedClass) return;

    const selected = classes.find((c) => c.id == selectedClass);

    api
      .get(`api/timetables/subjects?semester=${selected?.semester}`)
      .then((res) => setSubjects(res.data))
      .catch(() => showToast("Error fetching subjects", "error"));

    api
      .get(`api/timetables/faculties`)
      .then((res) => setFaculties(res.data))
      .catch(() => showToast("Error fetching faculties", "error"));
  }, [selectedClass]);

  /* ================= HANDLE EDIT ================= */
  const handleChange = (dayIndex, slotIndex, field, value) => {
    const updated = [...lectureData];
    updated[dayIndex].slots[slotIndex][field] = value;
    setLectureData(updated);
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    try {
      for (const day of lectureData) {
        for (const slot of day.slots) {
          if (!slot.subject_id || !slot.faculty_id) continue;

          if (slot.id) {
            await api.put(`api/timetables/${slot.id}`, {
              subject_id: slot.subject_id,
              faculty_id: slot.faculty_id,
            });
          } else {
            await api.post(`api/timetables`, {
              class_id: selectedClass,
              subject_id: slot.subject_id,
              faculty_id: slot.faculty_id,
              day_of_week: day.day,
              start_time: slot.start,
              end_time: slot.end,
            });
          }
        }
      }

      showToast("Timetable Updated Successfully", "success");
      setIsEditMode(false);
    } catch (error) {
      console.error(error);
      showToast("Error updating timetable", "error");
    }
  };

  /* ================= CANCEL ================= */
  const handleCancel = () => {
    setLectureData(originalData);
    setIsEditMode(false);
  };

  /* ================= RESET ================= */
  const handleReset = () => {
    setActiveTab("menu");
    setValue("selectedClass", "");
  };

  /* ================= UI ================= */
  return (
    <DashboardChildPageTemplate
      title="View Timetable"
      desc="Select timetable type to view schedule"
      width="max-w-6xl"
    >
      <div className="pb-20 space-y-6">
        {/* MENU */}
        {activeTab === "menu" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              onClick={() => setActiveTab("lecture")}
              className="bg-[var(--card-bg)] p-8 rounded-xl border border-[var(--border-light)] cursor-pointer hover:bg-[var(--bg-hover)] transition"
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                  Lecture Timetable
                </h3>
              </div>
            </div>

            <div className="opacity-60 cursor-not-allowed bg-[var(--card-bg)] p-8 rounded-xl border border-[var(--border-light)]">
              <FileText className="h-8 w-8 text-purple-600" />
              <h3 className="text-[var(--text-primary)]">Exam Timetable</h3>
            </div>
          </div>
        )}

        {/* TABLE */}
        {activeTab === "lecture" && (
          <DashboardChildPageCard>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <button onClick={handleReset}>
                  <ArrowLeft size={24} className="text-[var(--icon-color)]" />
                </button>
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                  Lecture Schedule
                </h3>
              </div>

              {role === "Admin" && selectedClass && !isEditMode && (
                <button
                  onClick={() => setIsEditMode(true)}
                  className="bg-[var(--btn-blue-bg)] text-white px-4 py-2 rounded-lg hover:bg-[var(--btn-blue-hover)]"
                >
                  Edit
                </button>
              )}
            </div>

            {/* DROPDOWN */}
            <div className="mb-6 max-w-xs">
              <label className="custom-label">Select Class</label>
              <select className="custom-input" {...register("selectedClass")}>
                <option value="">Choose a class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.class_id}
                  </option>
                ))}
              </select>
            </div>

            {/* TABLE */}
            {selectedClass && (
              <>
                <div className="table-wrapper border border-[var(--border-light)] rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="sticky-header">
                      <tr>
                        <th className="sticky-col px-4 py-3 border-r border-[var(--border-light)]">
                          Day
                        </th>
                        {lectureData[0]?.slots.map((s, i) => (
                          <th key={i} className="px-4 py-3 whitespace-nowrap">
                            {s.start}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {lectureData.map((day, i) => (
                        <tr key={i} className="hover:bg-[var(--bg-hover)]">
                          <td className="sticky-col px-4 py-3 font-semibold border-r border-[var(--border-light)]">
                            {day.day}
                          </td>

                          {day.slots.map((slot, j) => (
                            <td
                              key={j}
                              className="px-3 py-3 border-r border-[var(--border-light)] min-w-[160px]"
                            >
                              {isEditMode ? (
                                <>
                                  <select
                                    className="custom-input mb-1"
                                    value={slot.subject_id}
                                    onChange={(e) =>
                                      handleChange(
                                        i,
                                        j,
                                        "subject_id",
                                        e.target.value,
                                      )
                                    }
                                  >
                                    <option value="">Subject</option>
                                    {subjects.map((s) => (
                                      <option
                                        key={s.subject_id}
                                        value={s.subject_id}
                                      >
                                        {s.subject_name}
                                      </option>
                                    ))}
                                  </select>

                                  <select
                                    className="custom-input"
                                    value={slot.faculty_id}
                                    onChange={(e) =>
                                      handleChange(
                                        i,
                                        j,
                                        "faculty_id",
                                        e.target.value,
                                      )
                                    }
                                  >
                                    <option value="">Faculty</option>
                                    {faculties.map((f) => (
                                      <option
                                        key={f.faculty_id}
                                        value={f.faculty_id}
                                      >
                                        {f.name}
                                      </option>
                                    ))}
                                  </select>
                                </>
                              ) : (
                                <>
                                  <div className="text-[var(--text-primary)] font-medium">
                                    {slot.subject || "-"}
                                  </div>
                                  <div className="text-xs text-[var(--text-muted)] mt-1">
                                    {slot.faculty || ""}
                                  </div>
                                </>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ACTION BUTTONS */}
                {isEditMode && (
                  <div className="form-actions">
                    <SaveButton onClick={handleSave} />
                    <CancelButton onClick={handleCancel} />
                  </div>
                )}
              </>
            )}
          </DashboardChildPageCard>
        )}
      </div>
    </DashboardChildPageTemplate>
  );
}
