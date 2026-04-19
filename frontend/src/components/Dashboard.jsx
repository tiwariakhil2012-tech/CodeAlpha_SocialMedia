import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"; 

const Dashboard = () => {
  const role = localStorage.getItem("userRole");
  const email = localStorage.getItem("userEmail");
  const name = localStorage.getItem("userName");  
  const location = useLocation();
  const navigate = useNavigate(); 

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
  const hasRefreshed = sessionStorage.getItem('hasRefreshed');

  if (!hasRefreshed) {
    sessionStorage.setItem('hasRefreshed', 'true');
    window.location.reload();
  }
}, []);

  const handleLogout = () => {
    localStorage.clear(); 
    navigate("/login");
  };
  

  const navLinkStyle = (active) => ({
    color: active ? "#0a74e9" : "#3a5a81",
    fontWeight: active ? "700" : "500",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 20px",
    borderRadius: "12px",
    backgroundColor: active ? "rgba(10, 116, 233, 0.15)" : "transparent",
    boxShadow: active ? "0 4px 20px rgba(10, 116, 233, 0.2)" : "none",
    transition: "all 0.3s ease",
    fontSize: "1.05rem",
    userSelect: "none",
    cursor: "pointer",
  });

  const getInitials = () => {
    if (name) return name.charAt(0).toUpperCase();
    if (!email) return "U";
    return email.charAt(0).toUpperCase();
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
        background: "#f0f6fc",
      }}
    >
      {/* Sidebar */}
      <nav
        style={{
          width: "260px",
          background: "linear-gradient(135deg, #e5f0ff 60%, #cfe1fc 100%)",
          boxShadow: "6px 0 35px rgba(12, 72, 168, 0.12), inset 1px 0px 9px #d3e2fb",
          borderTopRightRadius: "44px",
          borderBottomRightRadius: "44px",
          padding: "40px 24px",
          position: "fixed",
          top: 0,
          bottom: 0,
          overflowY: "auto",
          zIndex: 10,
        }}
      >
        <div style={{ marginBottom: 50, textAlign: "center", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              width: 55,
              height: 55,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
              boxShadow: "0 6px 18px #3a7bd578",
              color: "white",
              fontWeight: "700",
              fontSize: 24,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "2px solid #0c3d91",
              marginBottom: "15px"
            }}
          >
            {getInitials()}
          </div>
          <h2 style={{ color: "#0c3d91", margin: 0, fontWeight: "700", fontSize: "1.5rem" }}>
            SocialApp
          </h2>
        </div>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li style={{ marginBottom: 12 }}>
            <Link to="/user/feed" style={navLinkStyle(isActive("/user/feed"))}>
              <i className="fa-solid fa-house-chimney-user "></i> Home Feed
            </Link>
          </li>
          <li style={{ marginBottom: 12 }}>
            <Link to="/user/profile" style={navLinkStyle(isActive("/user/profile"))}>
              <i className="fa-solid fa-circle-user"></i> Profile
            </Link>
          </li>
          <li style={{ marginBottom: 12 }}>
            <Link to="/user/message" style={navLinkStyle(isActive("/user/message"))}>
              <i className="fa-regular fa-comment-dots"></i> Messages
            </Link>
          </li>
          <li style={{ marginBottom: 12 }}>
            <Link to="/user/changepassword" style={navLinkStyle(isActive("/user/changepassword"))}>
              <i className="fa-solid fa-key"></i> Security
            </Link>
          </li>
          
          <li style={{ marginTop: "40px" }}>
            <div 
              onClick={handleLogout} 
              className="logout-btn"
              style={{
                ...navLinkStyle(false),
                color: "#d9534f",
                backgroundColor: "rgba(217, 83, 79, 0.05)"
              }}
            >
              🚪 Logout
            </div>
          </li>
        </ul>
      </nav>

      {/* Main content */}
      <main
        style={{
          marginLeft: 260,
          flexGrow: 1,
          minHeight: "100vh",
          padding: "20px 40px 48px 40px",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        {/* Topbar */}
        <header
          style={{
            background: "#ffffffcc",
            borderRadius: "20px",
            padding: "15px 30px",
            boxShadow: "0 7px 20px rgba(58, 123, 213, 0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 30,
            backdropFilter: "blur(12px)",
            position: "sticky",
            top: 20,
            zIndex: 5,
          }}
        >
          <h1 style={{ margin: 0, fontSize: "1.3rem", fontWeight: "700", color: "#0c3d91" }}>
            Welcome, {name || email?.split("@")[0] || "User"} 👋
          </h1>
          <p style={{ margin: 0, color: "#748ba7", fontSize: "0.85rem" }}>{email}</p>
        </header>

        {/* Content container */}
        <section
          style={{
            flexGrow: 1,
            background: "white",
            borderRadius: 24,
            padding: 30,
            boxShadow: "0 8px 40px rgba(74, 123, 255, 0.08)",
            minHeight: "80vh",
          }}
        >
          <Outlet />
        </section>
      </main>

      <style>{`
        .logout-btn:hover {
          background-color: rgba(217, 83, 79, 0.15) !important;
          transform: translateX(5px);
        }
        a:hover:not(.active) {
          background-color: rgba(10, 116, 233, 0.05);
          transform: translateX(5px);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;