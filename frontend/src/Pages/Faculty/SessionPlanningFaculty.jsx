import React from "react";
import { useForm } from "react-hook-form";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import { Plus, BookOpen, Save } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/axios.js";

export default function SessionPlanningFaculty() {


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const [data, setData] = useState([]);
  const [topics, setTopics] = useState([]); // store topics for UI only
  const [topicInput, setTopicInput] = useState(""); // temp topic input

  // fetch teaching info
  useEffect(() => {
    api
      .get("/api/session/teaching-info")
      .then((res) => {
        setData([res.data.data.teaching_info]);
      })
      .catch((error) => {
        console.log("error", error.response?.status, error.response?.data);
      });
  }, []);

  // extracting classes
  const classes = data.flat().map((item) => item.class);

  // watch selected class to filter subjects
  const selectedClass = watch("selectedClass");

  // filter subjects based on selected class
  const subjects = data
    .flat()
    .filter(
      (item) => item.class.class_pk === Number(selectedClass)
    )
    .flatMap((item) => item.subjects);

  // add topic to list (UI purpose)
  const addTopic = () => {
    if (topicInput.trim() === "") return;
    setTopics((prev) => [...prev, topicInput.trim()]);
    setTopicInput("");
  };

  // remove topic
  const removeTopic = (index) => {
    setTopics((prev) => prev.filter((_, i) => i !== index));
  };

  const onFormSubmit = (formData) => {
    if (topics.length === 0) {
      alert("Please add at least one topic");
      return;
    }

    // convert topics array into string (API compatible format)
    const topicString = topics.join(", ");

    api
      .post(
        "/api/session/",
        {
          class_pk: Number(formData.selectedClass),
          subject_id: formData.subject,
          lecture_no: Number(formData.lectureNumber),
          date: formData.date,
          topics: topicString, // ✅ sent as STRING (original behavior)
        }
      )
      .then(() => {
        alert("Session created successfully");
        reset();
        setTopics([]);
      })
      .catch((error) => {
        alert(
          error.response?.data?.message ||
            "Error while creating session"
        );
      });
  };

  return (
    // Main Template
    <DashboardChildPageTemplate
      title="Session Planning"
      desc="Create and schedule session plans for your lectures"
      width="max-w-7xl"
    >
      <div className="pb-20">
        {/* Form Start */}
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Select class field*/}
            <DashboardChildPageCard>
              <label className="custom-label mb-2">Select Class</label>
              <select
                className="custom-input bg-[var(--bg-primary)] theme-transition"
                {...register("selectedClass", {
                  required: "Please select a class",
                })}
              >
                <option value="">Select class</option>
                {classes.map((cls) => (
                  <option
                    key={`${cls.class_pk}|${cls.semester}`}
                    value={cls.class_pk}
                  >
                    {`${cls.class_id} - Sem ${cls.semester}`}
                  </option>
                ))}
              </select>
              {errors.selectedClass && (
                <p className="custom-error">
                  {errors.selectedClass.message}
                </p>
              )}
            </DashboardChildPageCard>

            <DashboardChildPageCard>
              {/* Select subject field*/}
              <label className="custom-label mb-2">Select Subject</label>
              <select
                className="custom-input bg-[var(--bg-primary)] theme-transition"
                {...register("subject", {
                  required: "Please select a subject",
                })}
                disabled={!selectedClass}
              >
                <option value="">Choose subject</option>
                {subjects.map((sub) => (
                  <option key={sub.subject_id} value={sub.subject_id}>
                    {sub.subject_name}
                  </option>
                ))}
              </select>
              {errors.subject && (
                <p className="custom-error">{errors.subject.message}</p>
              )}
            </DashboardChildPageCard>

            <DashboardChildPageCard>
              {/* Lecture number field*/}
              <label className="custom-label mb-2">Lecture Number</label>
              <input
                type="number"
                placeholder="Enter lecture number"
                className="custom-input bg-[var(--bg-primary)] theme-transition"
                {...register("lectureNumber", {
                  required: "Lecture number is required",
                  min: {
                    value: 1,
                    message: "Lecture number must be positive",
                  },
                })}
              />
              {errors.lectureNumber && (
                <p className="custom-error">
                  {errors.lectureNumber.message}
                </p>
              )}
            </DashboardChildPageCard>

            <DashboardChildPageCard>
              {/* select Date field*/}
              <label className="custom-label mb-2">Select Date</label>
              <input
                type="date"
                className="custom-input w-full bg-[var(--bg-primary)] theme-transition"
                {...register("date", {
                  required: "Date is required",
                  validate: (value) =>
                    new Date(value) >=
                      new Date().setHours(0, 0, 0, 0) ||
                    "Date cannot be in the past",
                })}
              />
              {errors.date && (
                <p className="custom-error">{errors.date.message}</p>
              )}
            </DashboardChildPageCard>

            {/* this is the add topic field input.*/}
            <DashboardChildPageCard>
              <div className="form-field">
                {/* Add topics field */}
                <label className="custom-label text-base mb-1">
                  Add Topics
                </label>
                <p className="text-sm text-[var(--text-light)] mb-4">
                  Add topics to be covered in this lecture
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    className="custom-input bg-[var(--bg-primary)] theme-transition flex-1"
                    placeholder="Enter topic name"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={addTopic}
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium"
                    style={{ backgroundColor: "#2563EB" }}
                  >
                    <Plus size={18} />
                    Add
                  </button>
                </div>

                {/* topic list */}
                {topics.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {topics.map((topic, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center p-2 border rounded-md"
                      >
                        <span>{topic}</span>
                        <button
                          type="button"
                          onClick={() => removeTopic(index)}
                          className="text-red-500 text-sm"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </DashboardChildPageCard>
          </div>

          {/* this is the buttons part*/}
          <div className="flex flex-wrap justify-end gap-4 mt-4">
            {/* Reset and Submit buttons */}
            <button
              type="button"
              onClick={() => {
                reset();
                setTopics([]);
              }}
              className="px-6 py-2.5 rounded-lg text-sm font-medium border theme-transition hover:bg-gray-50 dark:hover:bg-gray-800"
              style={{
                borderColor: "var(--border-medium)",
                color: "var(--text-primary)",
              }}
            >
              Reset Form
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--btn-primary-bg)",
                color: "var(--btn-primary-text)",
              }}
            >
              <Save size={18} />
              Create Session Plan
            </button>
          </div>
        </form>
      </div>
    </DashboardChildPageTemplate>
  );
}
