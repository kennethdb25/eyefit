import { useState, useContext, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import LoginSignUp from "./pages/LoginSignUp";
import { LoginContext } from "./context/LoginContext";
import Home from "./pages/dashboard";
import DashboardLayout from "./pages/global/DashboardLayout";
import Products from "./pages/products";
import Appointments from "./pages/appointments";
import Orders from "./pages/orders";
import Inventory from "./pages/inventory";
import Reports from "./pages/reports";
import Setting from "./pages/setting";
import Delivery from "./pages/delivery";

function App() {
  // eslint-disable-next-line no-unused-vars
  const { loginData, setLoginData } = useContext(LoginContext);
  const history = useNavigate();
  const location = useLocation();

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

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
        console.log(res);
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
      // setData(true);
    }, 3000);
    // fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
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
            path="/reports"
            element={
              <DashboardLayout
                OpenSidebar={OpenSidebar}
                openSidebarToggle={openSidebarToggle}
              >
                <Reports />
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
              >
                <Setting />
              </DashboardLayout>
            }
          />
        </>
      )}
    </Routes>
  );
}

export default App;
