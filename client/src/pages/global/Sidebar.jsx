import { useNavigate } from "react-router-dom";
import React from "react";
import {
  BsEyeglasses,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsCalendar3,
  BsPeopleFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsFillGearFill,
  BsTruck,
} from "react-icons/bs";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const navigate = useNavigate();

  const onNavigate = (path) => {
    navigate(path);
  };

  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <BsEyeglasses className="icon_header" /> EYEFIT
        </div>
        <span className="icon close_icon" onClick={OpenSidebar}>
          X
        </span>
      </div>

      <ul className="sidebar-list">
        <li
          className="sidebar-list-item"
          onClick={() => {
            onNavigate("/home");
          }}
        >
          <BsGrid1X2Fill className="icon" /> Dashboard
        </li>
        <li
          className="sidebar-list-item"
          onClick={() => {
            onNavigate("/products");
          }}
        >
          <BsFillArchiveFill className="icon" /> Products
        </li>
        <li
          className="sidebar-list-item"
          onClick={() => {
            onNavigate("/appointments");
          }}
        >
          <BsCalendar3 className="icon" />
          Appointments
        </li>
        <li
          className="sidebar-list-item"
          onClick={() => {
            onNavigate("/order");
          }}
        >
          <BsPeopleFill className="icon" /> Orders
        </li>
        <li
          className="sidebar-list-item"
          onClick={() => {
            onNavigate("/delivery");
          }}
        >
          <BsTruck className="icon" /> Delivery
        </li>
        <li
          className="sidebar-list-item"
          onClick={() => {
            onNavigate("/inventory");
          }}
        >
          <BsListCheck className="icon" /> Inventory
        </li>
        <li
          className="sidebar-list-item"
          onClick={() => {
            onNavigate("/reports");
          }}
        >
          {/* Remove reports in Sidebar and App.js (Main Content) */}
          <BsMenuButtonWideFill className="icon" /> Reports
        </li>
        {/* <li
          className="sidebar-list-item"
          onClick={() => {
            onNavigate("/setting");
          }}
        >
          <BsFillGearFill className="icon" /> Setting
        </li> */}
      </ul>
    </aside>
  );
}

export default Sidebar;
