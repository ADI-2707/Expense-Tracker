import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
        useEffect(() => {
          if (!userId) {
            navigate("/login");
          }
        },);
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
          <h4>Here is your <span className="text-primary">expense</span> overview!</h4>
        
      </div>
      <div>

      </div>
    </div>
  );
};

export default Dashboard;
