import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/dashboard" className="nav-link">
          <div className="nav-image">
            <img src="/logo.jpeg" alt="" className="nav-logo" />
          </div>
          UK BLOGGER
        </Link> 
      </div>
      <div className="greetings">
        {user ? <h3>Welcome, {user.userName}</h3> : null}
      </div>
      <div className="nav-links">
        {user ? (
          <>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
