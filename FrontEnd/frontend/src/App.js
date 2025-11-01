import Signup from "./components/Signup";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import AddExpense from "./components/AddExpense";
import ManageExpense from "./components/ManageExpense";
import ExpenseReport from "./components/ExpenseReport";
import ChangePassword from "./components/ChangePassword";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/addexpense" element={<AddExpense />} />
          <Route path="/manageexpense" element={<ManageExpense />} />
          <Route path="/expensereport" element={<ExpenseReport />} />
          <Route path="/changepassword" element={<ChangePassword />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
