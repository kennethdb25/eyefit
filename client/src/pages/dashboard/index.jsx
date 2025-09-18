import React, { useState, useEffect, useContext } from "react";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsFillBellFill,
} from "react-icons/bs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import "./Dashboard.css";
import { LoginContext } from "../../context/LoginContext";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { loginData } = useContext(LoginContext);
  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalCancelled: 0,
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(
          `/api/analytics/summary?company=${loginData?.body?.company}`
        );
        const data = await res.json();
        setSummary(data);
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };

    if (loginData?.body?.company) {
      fetchSummary();
    }
  }, [loginData]);

  // ✅ Set default start and end date on mount
  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Format date in local time (YYYY-MM-DD)
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    setStartDate(formatDate(firstDay));
    setEndDate(formatDate(lastDay));
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchOrders();
      fetchTopProducts();
    }
  }, [startDate, endDate]);

  const fetchOrders = async () => {
    try {
      let url = "/api/analytics/order?";
      const params = [];

      if (startDate && endDate) {
        params.push(`startDate=${startDate}&endDate=${endDate}`);
      }
      if (loginData?.body?.company) {
        params.push(`company=${loginData.body.company}`);
      }

      if (params.length > 0) {
        url += params.join("&");
      }

      const res = await fetch(url);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchTopProducts = async () => {
    try {
      let url = "/api/analytics/top-products?";
      const params = [];

      if (startDate && endDate) {
        params.push(`startDate=${startDate}&endDate=${endDate}`);
      }

      if (loginData?.body?.company) {
        params.push(`company=${loginData.body.company}`);
      }

      if (params.length > 0) {
        url += params.join("&");
      }

      const res = await fetch(url);
      const data = await res.json();
      setTopProducts(data);
    } catch (error) {
      console.error("Error fetching top products:", error);
    }
  };

  const chartData = orders.map((order) => ({
    date: order.date,
    total: order.total,
    items: order.items,
  }));

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>DASHBOARD</h3>
      </div>
      {loginData?.body?.userType !== "ADMIN USER" ? (
        <div className="main-cards">
          <div className="card">
            <div className="card-inner">
              <h3>PRODUCTS</h3>
              <BsFillArchiveFill className="card_icon" />
            </div>
            <h1>{summary.totalProducts}</h1>
          </div>
          <div className="card">
            <div className="card-inner">
              <h3>ORDERS</h3>
              <BsFillGrid3X3GapFill className="card_icon" />
            </div>
            <h1>{summary.totalOrders}</h1>
          </div>
          <div className="card">
            <div className="card-inner">
              <h3>CUSTOMERS</h3>
              <BsPeopleFill className="card_icon" />
            </div>
            <h1>{summary.totalCustomers}</h1>
          </div>
          <div className="card">
            <div className="card-inner">
              <h3>CANCELLED</h3>
              <BsFillBellFill className="card_icon" />
            </div>
            <h1>{summary.totalCancelled}</h1>
          </div>
        </div>
      ) : null}

      {loginData?.body?.userType !== "ADMIN USER" ? (
        <div className="dashboard">
          <h1>Order Analytics Dashboard</h1>
          <div className="filters">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          {/* Charts */}
          <div className="charts">
            <div className="chart">
              <h2>Total Sales Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="chart">
              <h2>Items Sold Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="items" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="chart" style={{ marginBottom: "20px" }}>
            <h2>TOP SELLING</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalQuantity" fill="#ff8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="table-container">
            <div className="order-details">
              <h2>TOTAL SALES PER DAY</h2>
            </div>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th className="table-head-dashboard">Date</th>
                  <th className="table-head-dashboard">Total</th>
                  <th className="table-head-dashboard">Total Items Sold</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((row, i) => (
                  <tr key={i}>
                    <td className="table-data-dashboard">{row.date}</td>
                    <td className="table-data-dashboard">{`Php ${row.total}.00`}</td>
                    <td className="table-data-dashboard">{row.items}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </main>
  );
}
