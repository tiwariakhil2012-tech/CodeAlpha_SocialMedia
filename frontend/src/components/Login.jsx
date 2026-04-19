import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', data);
      
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userName", res.data.user.name);
        localStorage.setItem("userEmail", res.data.user.email);
        
        const userId = res.data.user.id || res.data.user._id;
        localStorage.setItem("userId", userId);
        
        alert(`Welcome back, ${res.data.user.name}!`);
        
        navigate('/user/feed'); 
      }
    } catch (error) {
      const errorMsg = error.response?.data?.msg || 'Login failed. Please check your credentials.';
      alert(errorMsg);
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <h3>Welcome Back</h3>
        <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="email" className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Enter your email"
            value={data.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Enter your password"
            value={data.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn-primary">Login</button>
        
        <p className="footer-text">
          New here? <a href="/register">Create an account</a>
        </p>
      </form>

      <style>{`
        .login-wrapper {
          height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #dae9f7, #c4d4ec);
          font-family: 'Poppins', sans-serif;
          overflow: hidden;
        }

        .login-form {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border-radius: 25px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
          padding: 40px 38px;
          width: 100%;
          max-width: 420px;
          color: #112d4e;
          display: flex;
          flex-direction: column;
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }

        .login-form:hover {
          transform: scale(1.02);
          box-shadow: 0 12px 48px rgba(31, 38, 135, 0.25);
        }

        .login-form h3 {
          margin-bottom: 30px;
          font-size: 2.1rem;
          font-weight: 700;
          text-align: center;
          color: #0e223d;
        }

        .form-label {
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .form-control {
          padding: 14px 18px;
          border-radius: 16px;
          border: 1px solid transparent;
          width: 100%;
          background: #e3ecf9;
          box-shadow: inset 6px 6px 10px #bdd1f7, inset -6px -6px 10px #ffffff;
          margin-bottom: 22px;
          box-sizing: border-box;
          transition: all 0.35s ease;
        }

        .form-control:focus {
          outline: none;
          border: 1px solid #4b79a1;
          background: #f0f6ff;
          box-shadow: inset 2px 2px 5px #a5bbdb, inset -2px -2px 5px #ffffff;
        }

        .btn-primary {
          background: linear-gradient(135deg, #4b79a1, #283e51);
          color: #ffffff;
          padding: 14px 0;
          margin-top: 10px;
          font-size: 1.1rem;
          font-weight: 700;
          border-radius: 25px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #6a99cc, #405977);
          box-shadow: 0 8px 20px rgba(45, 68, 110, 0.4);
          transform: translateY(-2px);
        }

        .footer-text {
          text-align: center;
          margin-top: 25px;
          font-size: 0.9rem;
          color: #0f395c;
        }

        .footer-text a {
          color: #4b79a1;
          font-weight: 700;
          text-decoration: none;
        }

        .footer-text a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

export default Login;