import React from "react";
import PanelTemplateDashboard from "../../ui/PanelTemplateDashboard";
import DashContentPanelDashboard from "../../ui/DashContentPanelDashboard";
import ActionContainerDashboard from "../../ui/ActionContainerDashboard";
import ActionButtonDashboard from "../../ui/ActionButtonDashboard";

const AdminPanelDashboard = () => {
  return (
    <PanelTemplateDashboard
      user="Faculty"
    >
      {/* ROW 1 */}
      <DashContentPanelDashboard>
        <ActionContainerDashboard title="Class Management">
          <ActionButtonDashboard title="Add Student" />
          <ActionButtonDashboard title="Add Subject" />
          <ActionButtonDashboard title="Add New Classes" />
          <ActionButtonDashboard title="TimeTable" />
        </ActionContainerDashboard>

        <ActionContainerDashboard title="Attendance & Planning">
          <ActionButtonDashboard title="Take Attendance" />
          <ActionButtonDashboard title="Add Extra Attendance" />
          <ActionButtonDashboard title="Session Planning" />
          <ActionButtonDashboard title="Update Session Planning" />
        </ActionContainerDashboard>
      </DashContentPanelDashboard>

      {/* ROW 2 */}
      <DashContentPanelDashboard>
        <ActionContainerDashboard title="Report & Evaluation">
          <ActionButtonDashboard title="Datewise Report" />
          <ActionButtonDashboard title="Studentwise Report" />
          <ActionButtonDashboard title="Classwise Report" />
          <ActionButtonDashboard title="Feedback Evaluation" />
        </ActionContainerDashboard>

        <ActionContainerDashboard title="Profile & Resources">
          <ActionButtonDashboard title="Manage Profile" />
          <ActionButtonDashboard title="Upload Learning Material" />
          <ActionButtonDashboard title="Send Notifications" />
          <ActionButtonDashboard title="Live Classes" />
        </ActionContainerDashboard>
      </DashContentPanelDashboard>
    </PanelTemplateDashboard>
  );
};

export default AdminPanelDashboard;
