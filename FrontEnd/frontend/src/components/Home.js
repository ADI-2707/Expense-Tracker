import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const userId = localStorage.getItem("userId");
  return (
    <div className="container text-center mt-5">
      <h1>
        Welcome to <span className="text-primary">Daily Expense Tracker</span>
      </h1>
      <p className="lead">
        Track your expenses{" "}
        <span className="text-primary">easily and efficiently.</span>{" "}
      </p>
      <div className="mt-4">
        {userId ? (
          <>
            <Link to="/dashboard" className="btn btn-warning ms-3">
              <i className="fas fa-tachometer-alt me-2"></i>
              Go to Dashboard
            </Link>
          </>
        ) : (
          <>
            <Link to="/signup" className="btn btn-primary ms-3">
              <i className="fas fa-user-plus me-2"></i>
              Get Started
            </Link>
            <Link to="/login" className="btn btn-success ms-3">
              <i className="fas fa-sign-in-alt me-2"></i>
              Log In
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
