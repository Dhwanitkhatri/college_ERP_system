import React from "react";
import PanelTemplateDashboard from "../../ui/PanelTemplateDashboard";
import DashContentPanelDashboard from "../../ui/DashContentPanelDashboard";
import ActionContainerDashboard from "../../ui/ActionContainerDashboard";
import ActionButtonDashboard from "../../ui/ActionButtonDashboard";

const AdminPanelDashboard = () => {
  return (
    <PanelTemplateDashboard
      user="Student"
    >
      {/* ROW 1 */}
      <DashContentPanelDashboard>
        <ActionContainerDashboard title="Account & Credentials">
          <ActionButtonDashboard title="Change Credentials" />
          <ActionButtonDashboard title="Manage Profile" />
          <ActionButtonDashboard title="Print Fee Chalan" />
          <ActionButtonDashboard title="View Notices" />
        </ActionContainerDashboard>

        <ActionContainerDashboard title="Academic Reports">
          <ActionButtonDashboard title="Attendance Report" />
          <ActionButtonDashboard title="Generate Exam Result" />
          <ActionButtonDashboard title="Examination Result" />
          <ActionButtonDashboard title="View Documents" />
        </ActionContainerDashboard>
      </DashContentPanelDashboard>

      {/* ROW 2 */}
      <DashContentPanelDashboard>
        <ActionContainerDashboard title="Applications & Feedback">
          <ActionButtonDashboard title="Make Application" />
          <ActionButtonDashboard title="Feedback" />
          <ActionButtonDashboard title="Complaint Box" />
          <ActionButtonDashboard title="Examination Form" />
        </ActionContainerDashboard>

        <ActionContainerDashboard title="Learning & Resources">
          <ActionButtonDashboard title="Learning Material" />
          <ActionButtonDashboard title="Homework" />
          <ActionButtonDashboard title="Online Fee Payment" />
          <ActionButtonDashboard title="Live Classes" />
        </ActionContainerDashboard>
      </DashContentPanelDashboard>
    </PanelTemplateDashboard>
  );
};

export default AdminPanelDashboard;
