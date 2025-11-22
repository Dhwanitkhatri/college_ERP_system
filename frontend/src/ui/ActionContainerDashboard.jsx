import React from "react";
import ActionButtonDashboard from "./ActionButtonDashboard";

const ActionContainerDashboard = () => {
  return (
    <div className="actionContainer border rounded-xl bg-white shadow-sm p-5 m-3 flex-1 min-w-[280px] sm:min-w-[300px] lg:min-w-[420px]">
      <div className="actionTitle mb-3">
        <h3 className="font-semibold text-lg">[Action Tile]</h3>
      </div>
      <div className="actionButtonHolder grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ActionButtonDashboard label=""/>
        <ActionButtonDashboard label=""/>
        <ActionButtonDashboard label=""/>
        <ActionButtonDashboard label=""/>
        <ActionButtonDashboard label=""/>
        <ActionButtonDashboard label=""/>
      </div>
    </div>
  );
};

export default ActionContainerDashboard;
