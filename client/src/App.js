import { useState, useContext, useEffect, useRef } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { Spin } from "antd";
import LoginSignUp from "./pages/LoginSignUp";
import { LoginContext } from "./context/LoginContext";
import Home from "./pages/dashboard";
import DashboardLayout from "./pages/global/DashboardLayout";
import Products from "./pages/products";
import Appointments from "./pages/appointments";
import Orders from "./pages/orders";
import Inventory from "./pages/inventory";
import Setting from "./pages/setting";
import Delivery from "./pages/delivery";
import "antd/dist/reset.css"; //

function App() {
  // eslint-disable-next-line no-unused-vars
  const { loginData, setLoginData } = useContext(LoginContext);
  const history = useNavigate();
  const location = useLocation();
  const timerRef = useRef(null);

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [data, setData] = useState("");
  const [percent, setPercent] = useState(-50);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setPercent((v) => {
        const nextPercent = v + 5;
        return nextPercent > 150 ? -50 : nextPercent;
      });
    }, 100);
    return () => clearTimeout(timerRef.current);
  }, [percent]);
  const mergedPercent = percent;

  const LoginValidation = async () => {
    if (localStorage.getItem("accountToken")) {
      let validToken = localStorage.getItem("accountToken");
      const data = await fetch("/api/user/validate", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: validToken,
        },
      });
      const res = await data.json();

      if (res.status === 401 || !res || !location.pathname === "/") {
        console.log(res);
      } else {
        console.log("Verified User");
        setLoginData(res);
        history("/home");
      }
    }
  };

  useEffect(() => {
    // appointmentDataFetch();
    setTimeout(() => {
      LoginValidation();
    }, 3000);
    setTimeout(() => {
      setData(true);
    }, 3000);
    // fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {data ? (
        <div className="app">
          <Routes>
            <Route
              path="/"
              element={<LoginSignUp LoginValidation={LoginValidation} />}
            />
            {loginData && (
              <>
                <Route
                  path="/home"
                  element={
                    <DashboardLayout
                      OpenSidebar={OpenSidebar}
                      openSidebarToggle={openSidebarToggle}
                      setData={setData}
                    >
                      <Home />
                    </DashboardLayout>
                  }
                />
              </>
            )}
            {loginData && (
              <>
                <Route
                  path="/products"
                  element={
                    <DashboardLayout
                      OpenSidebar={OpenSidebar}
                      openSidebarToggle={openSidebarToggle}
                      setData={setData}
                    >
                      <Products />
                    </DashboardLayout>
                  }
                />
              </>
            )}
            {loginData && (
              <>
                <Route
                  path="/appointments"
                  element={
                    <DashboardLayout
                      OpenSidebar={OpenSidebar}
                      openSidebarToggle={openSidebarToggle}
                      setData={setData}
                    >
                      <Appointments />
                    </DashboardLayout>
                  }
                />
              </>
            )}
            {loginData && (
              <>
                <Route
                  path="/order"
                  element={
                    <DashboardLayout
                      OpenSidebar={OpenSidebar}
                      openSidebarToggle={openSidebarToggle}
                      setData={setData}
                    >
                      <Orders />
                    </DashboardLayout>
                  }
                />
              </>
            )}
            {loginData && (
              <>
                <Route
                  path="/delivery"
                  element={
                    <DashboardLayout
                      OpenSidebar={OpenSidebar}
                      openSidebarToggle={openSidebarToggle}
                      setData={setData}
                    >
                      <Delivery />
                    </DashboardLayout>
                  }
                />
              </>
            )}
            {loginData && (
              <>
                <Route
                  path="/inventory"
                  element={
                    <DashboardLayout
                      OpenSidebar={OpenSidebar}
                      openSidebarToggle={openSidebarToggle}
                      setData={setData}
                    >
                      <Inventory />
                    </DashboardLayout>
                  }
                />
              </>
            )}
            {loginData && (
              <>
                <Route
                  path="/setting"
                  element={
                    <DashboardLayout
                      OpenSidebar={OpenSidebar}
                      openSidebarToggle={openSidebarToggle}
                      setData={setData}
                    >
                      <Setting />
                    </DashboardLayout>
                  }
                />
              </>
            )}
          </Routes>
        </div>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            color: "white",
          }}
        >
          <Spin percent={mergedPercent} size="large" />
        </Box>
      )}
    </div>
  );
}

export default App;
