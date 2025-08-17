import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login.tsx";
import HomePage from "./pages/Home.tsx";
import SignupPage from "./pages/Signup.tsx";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </>
  );
};

export default App;
