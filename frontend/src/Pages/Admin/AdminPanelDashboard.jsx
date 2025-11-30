import React from "react";
import DashContentPanelDashboard from "../../ui/DashContentPanelDashboard";
import ActionContainerDashboard from "../../ui/ActionContainerDashboard";
import ActionButtonDashboard from "../../ui/ActionButtonDashboard";
import PanelTemplateDashboard from "../../ui/PanelTemplateDashboard";
import { Link } from "react-router-dom";

const AdminPanelDashboard = () => {
  return (
    <PanelTemplateDashboard
      user="Admin"
    >
      {/* ROW 1 */}
      <DashContentPanelDashboard>
        <ActionContainerDashboard title="Add New">
          <Link to="AddFacultyAdmin"> <ActionButtonDashboard title="Add Faculty" /></Link>
          <Link to="AddStudentAdmin"><ActionButtonDashboard title="Add Student" /></Link>
          <Link to="AddCourseAdmin"><ActionButtonDashboard title="Add Course" /></Link>
          <Link to="AddSubjectAdmin"><ActionButtonDashboard title="Add Subject" /></Link>
          <Link to="AddClassAdmin"><ActionButtonDashboard title="Add New Classes" /></Link>
          <Link to="AddTimeTableAdmin"><ActionButtonDashboard title="Add Time Table" /></Link>
        </ActionContainerDashboard>

        <ActionContainerDashboard title="Manage">
          <Link to="ManageFacultyAdmin"><ActionButtonDashboard title="Manage Faculty" /></Link>
          <ActionButtonDashboard title="Manage Student" />
          <ActionButtonDashboard title="Manage Settings" />
        </ActionContainerDashboard>
      </DashContentPanelDashboard>

      {/* ROW 2 */}
      <DashContentPanelDashboard>
        <ActionContainerDashboard title="Reports">
          <ActionButtonDashboard title="Datewise Report" />
          <ActionButtonDashboard title="Studentwise Report" />
          <ActionButtonDashboard title="Classwise Report" />
        </ActionContainerDashboard>

        <ActionContainerDashboard title="Communication & Services">
          <ActionButtonDashboard title="Send Notifications" />
          <ActionButtonDashboard title="Check Fee Status" />
          <ActionButtonDashboard title="Live Classes" />
        </ActionContainerDashboard>
      </DashContentPanelDashboard>
    </PanelTemplateDashboard>
  );
};

export default AdminPanelDashboard;
