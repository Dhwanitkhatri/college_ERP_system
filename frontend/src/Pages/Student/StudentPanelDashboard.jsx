import React from "react";
import DashContentPanelDashboard from "../../ui/Templates/DashContentPanelDashboard";
import ActionContainerDashboard from "../../ui/Templates/ActionContainerDashboard";
import ActionButtonDashboard from "../../ui/Buttons/ActionButtonDashboard";
import PanelTemplateDashboard from "../../ui/Templates/PanelTemplateDashboard";
import { useOutletContext, Link } from "react-router-dom";

const AdminPanelDashboard = () => {
  const { username } = useOutletContext();
  return (
    <PanelTemplateDashboard
      username={username}
    >
      {/* ROW 1 */}
      <DashContentPanelDashboard>
        <ActionContainerDashboard title="Account & Credentials">
          <Link to="ChangeCredentials"><ActionButtonDashboard title="Change Credentials" /></Link>
          <ActionButtonDashboard title="Manage Profile" />
          <ActionButtonDashboard title="Print Fee Chalan" />
          {/* <ActionButtonDashboard title="View Notices" /> */}
        </ActionContainerDashboard>

        <ActionContainerDashboard title="Academic Reports">
          <Link to="ViewAttendanceReportStudent"><ActionButtonDashboard title="Attendance Report" /></Link>
          {/* <ActionButtonDashboard title="Generate Exam Result" /> */}
          <ActionButtonDashboard title="Examination Result" />
          {/* <ActionButtonDashboard title="View Documents" /> */}
        </ActionContainerDashboard>
      </DashContentPanelDashboard>

      {/* ROW 2 */}
      <DashContentPanelDashboard>
        <ActionContainerDashboard title="Applications & Feedback">
          {/* <ActionButtonDashboard title="Make Application" /> */}
          <Link to="FacultyFeedBackStudent"><ActionButtonDashboard title="Feedback" /></Link>
          {/* <ActionButtonDashboard title="Complaint Box" /> */}
          <ActionButtonDashboard title="Examination Form" />
        </ActionContainerDashboard>

        <ActionContainerDashboard title="Learning & Resources">
          <Link to="LearningMaterialStudent"><ActionButtonDashboard title="Learning Material" /></Link>
          {/* <ActionButtonDashboard title="Homework" /> */}
          <Link to="NotAvailablePage"><ActionButtonDashboard title="Online Fee Payment" /></Link>
          <Link to="NotAvailablePage"><ActionButtonDashboard title="Live Classes" /></Link>
          <Link to="ViewTimeTable"><ActionButtonDashboard title="View Time Table" /></Link>
        </ActionContainerDashboard>
      </DashContentPanelDashboard>
    </PanelTemplateDashboard>
  );
};

export default AdminPanelDashboard;
