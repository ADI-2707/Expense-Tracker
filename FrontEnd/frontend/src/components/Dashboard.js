import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import {Chart, ArcElement, Tooltip, Legend} from 'chart.js'
import { b } from "framer-motion/client";

Chart.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {

  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");

  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [yesterdayTotal, setYesterdayTotal] = useState(0);
  const [last7Total, setLast7Total] = useState(0);
  const [last30Total, setLast30Total] = useState(0);
  const [currentYearTotal, setCurrentYearTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  const pieData = {
    labels : expenses.map(exp=>exp.ExpenseItem),
    datasets: [{
      label : 'Expense Cost',
      data: expenses.map(exp=>parseFloat(exp.ExpenseCost)),
      backgroundColor: ['red', 'blue', 'green', 'yellow', 'purple', 'gray'],
      borderWidth: 1,
  }],
  }

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
    fetchExpenses(userId);
  }, []);

  const fetchExpenses = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/manage_expense/${userId}/`
      );
      const data = await response.json();
      setExpenses(data);
      calculateTotals(data);
    } catch (error) {
      console.error("Error fetching expenses: ", error);
    }
  };

  const calculateTotals = (data) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const last7Days = new Date();
    last7Days.setDate(today.getDate() - 7);
    const last30Days = new Date();
    last30Days.setDate(today.getDate() - 30);
    const currentYear = today.getFullYear();

    let todaySum = 0;
    let yesterdaySum = 0;
    let last7Sum = 0;
    let last30Sum = 0;
    let currentYearSum = 0;
    let grandSum = 0;

    data.forEach(item => {
      const expenseDate = new Date(item.ExpenseDate);
      const amount = parseFloat(item.ExpenseCost) || 0;

      if (expenseDate.toDateString() === today.toDateString()) {
        todaySum += amount;
      }
      if (expenseDate.toDateString() === yesterday.toDateString()) {
        yesterdaySum += amount;
      }
      if (expenseDate >= last7Days) {
        last7Sum += amount;
      }
      if (expenseDate >= last30Days) {
        last30Sum += amount;
      }
      if (expenseDate.getFullYear() === currentYear) {
        currentYearSum += amount;
      }
      grandSum += amount;
    })

    setTodayTotal(todaySum);
    setYesterdayTotal(yesterdaySum);
    setLast7Total(last7Sum);
    setLast30Total(last30Sum);
    setCurrentYearTotal(currentYearSum);
    setGrandTotal(grandSum);
  }

  return (
    <div className="container mt-2">
      <div className="text-center">
        <h2 className="mt-5">
          Welcome <span className="text-primary">{userName}</span>!
        </h2>
        <p className="text-muted">
          Your dashboard is where you can track your{" "}
          <span className="text-primary">expenses</span> and manage your{" "}
          <span className="text-primary">budget</span> effectively.
        </p>
        <h4 className="mb-4">
          Here is your <span className="text-primary">expense</span> overview!
        </h4>
      </div>
      <div>
        <div className="row">
          <div className="col-md-4">
            <div
              className="card text-white bg-primary mb-3"
              style={{ height: "165px" }}
            >
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fas fa-calendar-day me-2"></i>Today's Expense
                </h5>
                <p className="card-text" style={{ fontSize: "60px" }}>
                  ₹{todayTotal}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="card text-white bg-success mb-3"
              style={{ height: "165px" }}
            >
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fas fa-calendar-minus me-2"></i>Yesterday's
                  Expense
                </h5>
                <p className="card-text" style={{ fontSize: "60px" }}>
                  ₹{yesterdayTotal}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="card text-white bg-warning mb-3"
              style={{ height: "165px" }}
            >
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fas fa-calendar-alt me-2"></i>This Year's
                  Expense
                </h5>
                <p className="card-text" style={{ fontSize: "60px" }}>
                  ₹{currentYearTotal}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="card text-white bg-info mb-3"
              style={{ height: "165px" }}
            >
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fas fa-calendar-week me-2"></i>Last 7 Days'
                  Expense
                </h5>
                <p className="card-text" style={{ fontSize: "60px" }}>
                  ₹{last7Total}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="card text-white bg-danger mb-3"
              style={{ height: "165px" }}
            >
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fas fa-calendar-day me-2"></i>Last 30 Days'
                  Expense
                </h5>
                <p className="card-text" style={{ fontSize: "60px" }}>
                  ₹{last30Total}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="card text-white bg-secondary  mb-3"
              style={{ height: "165px" }}
            >
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fas fa-wallet me-2"></i>Total
                  Expense
                </h5>
                <p className="card-text" style={{ fontSize: "60px" }}>
                  ₹{grandTotal}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5" style={{width:'400px', height:'400px', margin:'0 auto'}}>
        <h4 className='text-center'><span className="text-primary">Expense</span> Distribution</h4>
        <Pie data={pieData} />
      </div>
    </div>
  );
};

export default Dashboard;
