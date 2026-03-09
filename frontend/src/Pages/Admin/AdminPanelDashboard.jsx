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
          <Link to="CreateEventAdmin"><ActionButtonDashboard title="Add Event" /></Link>
          </ActionContainerDashboard>

        <ActionContainerDashboard title="Manage">
          <Link to="ManageFacultyAdmin"><ActionButtonDashboard title="Manage Faculty" /></Link>
          <Link to="ManageStudentAdmin"><ActionButtonDashboard title="Manage Student" /></Link>
          <Link to="ManageSettingsAdmin"><ActionButtonDashboard title="Manage Settings" /></Link>
          <Link to="Events"><ActionButtonDashboard title="Manage Events" /></Link>
          <Link to="ManageSubjectsAdmin"><ActionButtonDashboard title="Manage Subjects" /></Link>
          <Link to="ManageNotificationsAdmin"><ActionButtonDashboard title="Manage Notifications" /></Link>
        </ActionContainerDashboard>
      </DashContentPanelDashboard>

      {/* ROW 2 */}
      <DashContentPanelDashboard>
        <ActionContainerDashboard title="Reports">
          <Link to="DatewiseReportAdmin"><ActionButtonDashboard title="Datewise Report" /></Link>
          <Link to="NotAvailablePage"><ActionButtonDashboard title="Studentwise Report" /></Link>
          <Link to="ClasswiseReportAdmin"><ActionButtonDashboard title="Classwise Report" /></Link>
          <Link to="OverallClassReportAdmin"><ActionButtonDashboard title="Overall Class Report" /></Link>
          <Link to="ViewTimeTable"><ActionButtonDashboard title="View Time Table" /></Link>
          <Link to="FeedbackEvaluationAdmin"><ActionButtonDashboard title="Feedback Evaluation" /></Link>
          <Link to="GenerateExamResultAdmin"><ActionButtonDashboard title="Generate Result" /></Link>
        </ActionContainerDashboard>

        <ActionContainerDashboard title="Communication & Services">
          <Link to="SendNotificationAdmin"><ActionButtonDashboard title="Send Notifications" /></Link>
          <Link to="CheckFeeStatusAdmin"><ActionButtonDashboard title="Check Fee Status" /></Link>
          <Link to="PayFeeAdmin"><ActionButtonDashboard title="Pay Fee" /></Link>
          <Link to="NotAvailablePage"><ActionButtonDashboard title="Live Classes" /></Link>
          <Link to="CreateFeeStructureAdmin"><ActionButtonDashboard title="Create Fee Structure" /></Link>
          <Link to="ChangeCredentials"><ActionButtonDashboard title="Change Credentials" /></Link>
        </ActionContainerDashboard>
      </DashContentPanelDashboard>

      {/* ROW 3 */}
      <DashContentPanelDashboard>
        <ActionContainerDashboard title="Exam">
          <Link to="CreateSubjectComponentAdmin"><ActionButtonDashboard title="Create Subject Component"></ActionButtonDashboard></Link>
          <Link to="CreateExamAdmin"><ActionButtonDashboard title="Create Exam"></ActionButtonDashboard></Link>
          <Link to="AddExamTimeTableAdmin"><ActionButtonDashboard title="Add Exam TimeTable"></ActionButtonDashboard></Link>
        </ActionContainerDashboard>
      </DashContentPanelDashboard>
    </PanelTemplateDashboard>
  );
};

export default AdminPanelDashboard;
