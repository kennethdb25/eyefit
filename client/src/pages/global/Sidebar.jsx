/* eslint-disable no-unused-vars */
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  BsEyeglasses,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsCalendar3,
  BsPeopleFill,
  BsListCheck,
  BsTruck,
  BsFillGearFill,
} from "react-icons/bs";
import { LoginContext } from "../../context/LoginContext.js";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const navigate = useNavigate();
  const { loginData, setLoginData } = useContext(LoginContext);

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
          <img style={{ width: "150px", height: "150px" }} src="/icon.png" />{" "}
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
          hidden={loginData.body.userType === "ADMIN USER" ? true : false}
          onClick={() => {
            onNavigate("/products");
          }}
        >
          <BsFillArchiveFill className="icon" /> Products
        </li>
        <li
          className="sidebar-list-item"
          hidden={loginData.body.userType === "ADMIN USER" ? true : false}
          onClick={() => {
            onNavigate("/appointments");
          }}
        >
          <BsCalendar3 className="icon" />
          Appointments
        </li>
        <li
          className="sidebar-list-item"
          hidden={loginData.body.userType === "ADMIN USER" ? true : false}
          onClick={() => {
            onNavigate("/order");
          }}
        >
          <BsPeopleFill className="icon" /> Orders
        </li>
        <li
          className="sidebar-list-item"
          hidden={loginData.body.userType === "ADMIN USER" ? true : false}
          onClick={() => {
            onNavigate("/delivery");
          }}
        >
          <BsTruck className="icon" /> Delivery
        </li>
        <li
          className="sidebar-list-item"
          hidden={loginData.body.userType === "ADMIN USER" ? true : false}
          onClick={() => {
            onNavigate("/inventory");
          }}
        >
          <BsListCheck className="icon" /> Inventory
        </li>
        <li
          className="sidebar-list-item"
          hidden={loginData.body.userType !== "ADMIN USER" ? true : false}
          onClick={() => {
            onNavigate("/setting");
          }}
        >
          <BsFillGearFill className="icon" /> Setting
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
