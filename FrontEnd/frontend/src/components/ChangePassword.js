import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePassword = () => {

  const userId = localStorage.getItem("userId");

  const navigate = useNavigate();
  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, []);

  const [formData, setFormData] = useState({
    oldpassword: "",
    newpassword: "",
    confirmpassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.newpassword !== formData.confirmpassword){
        toast.error("Passwords do not match.");
        return;
    }
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/change_password/${userId}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            oldpassword: formData.oldpassword,
            newpassword: formData.newpassword
        }),
      });
      const data = await response.json();
      if (response.status === 200) {
        toast.success("Password changed successfully! Redirecting to login...");
        setFormData({
            oldpassword: "",
            newpassword: "",
            confirmpassword: "",
        });
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Something went wrong:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="text-center m-4">
        <h2>
          <i className="fas fa-key me-2"></i> Change Password
        </h2>
        <p className="text-muted">Secure your account with a new password.</p>
      </div>
      <form
        className="p-4 rounded shadow mx-auto"
        style={{ maxWidth: "600px" }}
        onSubmit={handleSubmit}
      >
        <div className="mb-3">
          <label className="form-label">Old Password</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-lock"></i>
            </span>
            <input
              type="password"
              name="oldpassword"
              value={formData.oldpassword}
              className="form-control"
              onChange={handleChange}
              placeholder="Enter your old password"
              required
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">New Password</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-lock-open"></i>
            </span>
            <input
              type="password"
              name="newpassword"
              value={formData.newpassword}
              className="form-control"
              onChange={handleChange}
              placeholder="Enter your new password"
              required
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Confirm New Password</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-lock"></i>
            </span>
            <input
              type="password"
              name="confirmpassword"
              value={formData.confirmpassword}
              className="form-control"
              onChange={handleChange}
              placeholder="Re-enter your new password"
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-100 mt-3">
          <i className="fas fa-key me-2"></i> Change Password
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ChangePassword;
