import { Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import SignUp from "./Components/SignUP";
import LandingPage from "./Components/LandingPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
