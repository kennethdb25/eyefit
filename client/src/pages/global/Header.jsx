/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { Button, Drawer, Radio, Space } from "antd";
import {
  BsFillBellFill,
  BsFillEnvelopeFill,
  BsPersonCircle,
  BsJustify,
} from "react-icons/bs";
import "../../index.css";
import { LoginContext } from "../../context/LoginContext";
import UserProfileModal from "./UserProfileModal/UserProfileModal";

function Header({ OpenSidebar, setData }) {
  const { loginData, setLoginData } = useContext(LoginContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [open, setOpen] = useState(false);

  const user = {
    name: loginData?.body.company,
    contact: loginData?.body.contact,
    email: loginData?.body.email,
    address: loginData?.body.address,
    user: loginData?.body?.userType,
    acctStatus: loginData?.body.acctStatus,
  };

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    <header className="headers">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>
      <div className="header-left">{/* <BsSearch className="icon" /> */}</div>
      <div className="header-right">
        <BsFillBellFill className="icon" onClick={() => showDrawer()} />
        <BsPersonCircle
          className="icon"
          onClick={() => setIsModalVisible(true)}
        />
      </div>
      <UserProfileModal
        user={user}
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        setData={setData}
      />
      <Drawer
        title="Notifications"
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
        key="right"
      >
        <p>Some notifications...</p>
        <p>Some notifications...</p>
        <p>Some notifications...</p>
      </Drawer>
    </header>
  );
}

export default Header;
