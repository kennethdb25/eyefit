// DashboardLayout.jsx
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const DashboardLayout = ({
  children,
  OpenSidebar,
  openSidebarToggle,
  setData,
}) => {
  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} setData={setData} />
      <Sidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />
      {children}
    </div>
  );
};

export default DashboardLayout;
