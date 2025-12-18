import React from "react";
import NavigateBackButton from "../Buttons/NavigateBackButton";

const DashboardChildPageTemplate = ({
  title,
  desc,
  children,
  width = "max-w-3xl", // DEFAULT WIDTH
}) => {
  return (
    <div className="mainDiv min-h-full bg-[var(--bg-secondary)] p-8 theme-transition">

      {/* HEADER */}
      <div className={`headerDiv ${width} mx-auto mb-8 flex items-start gap-4`}>
        <NavigateBackButton />
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">
            {title}
          </h1>
          <p className="text-sm mt-1 text-[var(--text-muted)]">
            {desc}
          </p>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div className={`${width} mx-auto`}>
        {children}
      </div>

    </div>
  );
};

export default DashboardChildPageTemplate;
