import React, { useEffect, useState } from "react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import api from "../../api/axios.js";


const StudentReportAdmin = () => {
 
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
