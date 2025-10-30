import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageExpense = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);

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
      console.log(data);
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses: ", error);
    }
  };

  return (
    <div className="mx-5">
      <div className="text-center m-5">
        <h2>
          <i className="fas fa-tasks me-1"></i> Manage Expense
        </h2>
        <p className="text-muted">
          Track Your <span className="text-primary">Expenses </span>Here
        </p>
      </div>
      <div className="mx-5">
        <table className="table table-striped table-bordered mx-auto ">
          <thead className="table-dark text-center">
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Item</th>
              <th>Cost (₹)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length > 0 ? (
              expenses.map((exp, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>{exp.ExpenseDate}</td>
                  <td>{exp.ExpenseItem}</td>
                  <td>{exp.ExpenseCost}</td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-warning me-3">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn btn-sm btn-danger">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No expenses found
                  <i className="fas fa-exclamation-circle ms-1"></i>
                </td>
              </tr>
            )}
          </tbody>
          <tbody></tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ManageExpense;
