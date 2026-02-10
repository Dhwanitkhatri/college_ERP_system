import React from "react";
import DashboardChildPageTemplate from "../ui/Templates/DashboardChildPageTemplate";
import ClassroomCard from "../ui/Cards/ClassroomCard";
import { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function Classroom() {
  const token = localStorage.getItem("token"); // Get token from localStorage
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    api
      .get("api/classes/current-year/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setClasses(res.data.data); // backend sends array
        console.log("Fetched faculties:", res.data);
      })
      .catch((err) => {
        console.error(
          "Error fetching faculties:",
          err.response?.data || err.message,
        );
      });
  }, []);

  return (
    <DashboardChildPageTemplate
      title="Classrooms"
      desc="view all classes with student count and mentor information"
      width="max-w-7xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <ClassroomCard
            key={`${cls.class_id}-${cls.semester}`}
            id={cls.id}
            name={cls.class_id}
            dept={cls.semester}
            students={cls.total_students || 0}
            mentor={cls.mentor_name || "Not Assigned"}
          />
        ))}
      </div>
    </DashboardChildPageTemplate>
  );
}
