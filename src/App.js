// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Dashboard from "./components/Dashboard";
// import UserDetails from "./components/UserDetails";
// import Navbar from "./components/Navbar";
// import EstonsoftLogin from "./components/EstonsoftLogin";
// import LoginPage from "./components/LoginPage";

// function App() {
//   return (
//     <Router>
//       <Routes>
//       <Route path="/" element={<LoginPage />} />
//       <Route path="/dashboard" element={<Dashboard />} />
//         {/* <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/users/:userId" element={<UserDetails />} /> */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import Dashboard from "./components/Dashboard";


const App = () => {
  return (
    <Router basename="/admin">
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
