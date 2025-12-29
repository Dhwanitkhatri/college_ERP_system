import React, { useEffect, useState } from "react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import api from "../../api/axios.js";


const StudentReportAdmin = () => {
  const [classes , setClasses] = useState([]);
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    // Fetch classes for datewise report
    api.get("api/reports/student/classes-for-datewise-report", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setClasses(res.data.classes) , console.log(res))
      .catch((err) => console.error(err.response?.data || err.message));
  }, []);
  console.log(classes);
  return (
    <DashboardChildPageTemplate
      title="Studentwise Report"
      desc="View comprehensive reports for individual students"
      width="max-w-6xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <DashboardChildPageCard>
          </DashboardChildPageCard>
        </div>
        <div className="lg:col-span-8">
          <DashboardChildPageCard>
          </DashboardChildPageCard>
        </div>
      </div>
    </DashboardChildPageTemplate>
  );
};

export default StudentReportAdmin;
