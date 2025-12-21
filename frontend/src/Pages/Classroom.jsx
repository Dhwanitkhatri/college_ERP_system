import React from "react";
import DashboardChildPageTemplate from "../ui/Templates/DashboardChildPageTemplate";
import ClassroomCard from "../ui/Cards/ClassroomCard";

export default function Classroom() {
  return (
    <DashboardChildPageTemplate
      title="Classrooms"
      desc="view all classes with student count and mentor information"
      width="max-w-7xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ClassroomCard
          name="TYBCA-A"
          dept="Computer Science"
          students="50"
          mentor="Aayush Bhavsar"
        />
        <ClassroomCard
          name="TYBCA-B"
          dept="Computer Science"
          students="50"
          mentor="Jiken Patel"
        />
        <ClassroomCard
          name="TYBCA-C"
          dept="Computer Science"
          students="50"
          mentor="Dhwanit Khatri"
        />
        <ClassroomCard
          name="TYBCA-D"
          dept="Computer Science"
          students="50"
          mentor="Yug Panchal"
        />
        <ClassroomCard
          name="TYBCA-E"
          dept="Computer Science"
          students="50"
          mentor="Kamado Tanjiro"
        />
        <ClassroomCard
          name="TYBCA-F"
          dept="Computer Science"
          students="50"
          mentor="Naruto Uzumaki"
        />
        <ClassroomCard
          name="TYBCA-G"
          dept="Computer Science"
          students="50"
          mentor="Jane Hopper"
        />
      </div>
    </DashboardChildPageTemplate>
  );
}
