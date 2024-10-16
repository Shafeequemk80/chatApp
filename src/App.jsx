import Login from "./pages/login/Login";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Note the change here
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Messenger from "./components/messenger/Messanger"; // Fixed typo in the import

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes> {/* Use Routes instead of Switch in v6 */}
        <Route path="/login" element={user ? <Messenger /> : <Login />} /> {/* Element prop for rendering */}
        <Route path="/messenger" element={user ? <Messenger /> :  <Login />} /> {/* Use Navigate for redirection */}
      </Routes>
    </Router>
  );
}

export default App;
