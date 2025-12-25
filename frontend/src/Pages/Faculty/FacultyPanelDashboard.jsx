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
