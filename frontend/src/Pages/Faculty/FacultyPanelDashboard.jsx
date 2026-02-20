import React from "react";
import DashContentPanelDashboard from "../../ui/Templates/DashContentPanelDashboard";
import ActionContainerDashboard from "../../ui/Templates/ActionContainerDashboard";
import ActionButtonDashboard from "../../ui/Buttons/ActionButtonDashboard";
import PanelTemplateDashboard from "../../ui/Templates/PanelTemplateDashboard";
import { useOutletContext, Link } from "react-router-dom";

const AdminPanelDashboard = () => {
  const { username } = useOutletContext();
  return (
    <PanelTemplateDashboard username={username}>
      {/* ROW 1 */}
      <DashContentPanelDashboard>
        <ActionContainerDashboard title="Attendance & Planning">
          <Link to="TakeAttendanceFaculty">
            <ActionButtonDashboard title="Take Attendance" />
          </Link>
          <ActionButtonDashboard title="Add Extra Attendance" />
          <Link to="SessionPlanningFaculty">
            <ActionButtonDashboard title="Session Planning" />
          </Link>
          <Link to="UpdateAttendanceFaculty">
            <ActionButtonDashboard title="update attendance" />
          </Link>
          <ActionButtonDashboard title="Update Session Planning" />
        </ActionContainerDashboard>
      </DashContentPanelDashboard>

      {/* ROW 2 */}
      <DashContentPanelDashboard>
        <ActionContainerDashboard title="Report & Evaluation">
          <Link to="DatewiseReportAdmin">
            <ActionButtonDashboard title="Datewise Report" />
          </Link>
          <ActionButtonDashboard title="Studentwise Report" />
          <Link to="ClasswiseReportAdmin">
            <ActionButtonDashboard title="Classwise Report" />
          </Link>
          <Link to="OverallClassReportAdmin">
            <ActionButtonDashboard title="Overall Class Report" />
          </Link>
          <ActionButtonDashboard title="Feedback Evaluation" />
        </ActionContainerDashboard>

        <ActionContainerDashboard title="Profile & Resources">
          <ActionButtonDashboard title="Manage Profile" />
          <ActionButtonDashboard title="Upload Learning Material" />
          <Link to="SendNotification">
            <ActionButtonDashboard title="Send Notifications" />
          </Link>
          <ActionButtonDashboard title="Live Classes" />
        </ActionContainerDashboard>
      </DashContentPanelDashboard>
    </PanelTemplateDashboard>
  );
};

export default AdminPanelDashboard;
