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
        <ActionContainerDashboard title="Add New">
          <Link to="AddFacultyAdmin"> <ActionButtonDashboard title="Add Faculty" /></Link>
          <Link to="AddStudentAdmin"><ActionButtonDashboard title="Add Student" /></Link>
          <Link to="AddSubjectAdmin"><ActionButtonDashboard title="Add Subject" /></Link>
          <Link to="AddClassAdmin"><ActionButtonDashboard title="Add New Classes" /></Link>
          <Link to="AddTimeTableAdmin"><ActionButtonDashboard title="Add Time Table" /></Link>
          </ActionContainerDashboard>

        <ActionContainerDashboard title="Manage">
          <Link to="ManageFacultyAdmin"><ActionButtonDashboard title="Manage Faculty" /></Link>
          <Link to="ManageStudentAdmin"><ActionButtonDashboard title="Manage Student" /></Link>
          <Link to="ManageSettingsAdmin"><ActionButtonDashboard title="Manage Settings" /></Link>
        </ActionContainerDashboard>
      </DashContentPanelDashboard>

      {/* ROW 2 */}
      <DashContentPanelDashboard>
        <ActionContainerDashboard title="Reports">
          <Link to="DatewiseReportAdmin"><ActionButtonDashboard title="Datewise Report" /></Link>
          <Link to="StudentReportAdmin"><ActionButtonDashboard title="Studentwise Report" /></Link>
          <Link to="ClasswiseReportAdmin"><ActionButtonDashboard title="Classwise Report" /></Link>
        </ActionContainerDashboard>

        <ActionContainerDashboard title="Communication & Services">
          <Link to="SendNotificationAdmin"><ActionButtonDashboard title="Send Notifications" /></Link>
          <ActionButtonDashboard title="Check Fee Status" />
          <ActionButtonDashboard title="Live Classes" />
        </ActionContainerDashboard>
      </DashContentPanelDashboard>
    </PanelTemplateDashboard>
  );
};

export default AdminPanelDashboard;
