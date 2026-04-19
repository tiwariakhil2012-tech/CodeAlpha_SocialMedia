import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const Registration = () => {
  const navigate = useNavigate(); 
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/register', formData);
      
      alert('Registration Successful!');
      
      navigate('/login'); 

    } catch (error) {
      console.error('Submission error:', error.response ? error.response.data : error.message);
      const errorMsg = error.response?.data?.msg || 'Failed to register. Please try again.';
      alert(errorMsg);
    }
  };

  return (
    <>
      <style>{`
        /* Your existing styles are perfect, keeping them as is */
        .registration-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 70%, #90caf9 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 15px;
          font-family: 'Montserrat', sans-serif;
          box-sizing: border-box;
        }
        
        .registration-box {
          background: #ffffffee;
          width: 100%;
          max-width: 500px;
          border-radius: 28px;
          box-shadow: 0 12px 20px rgba(79, 117, 189, 0.24);
          padding: 40px;
          border: 1.5px solid #a1c4fd;
        }

        .registration-header {
          font-size: 2.2rem;
          font-weight: 900;
          color: #3367d6;
          margin-bottom: 1.8rem;
          text-align: center;
        }

        .form-label {
          font-weight: 600;
          margin-bottom: 8px;
          display: block;
          color: #2e4486;
        }

        input.form-control {
          width: 100%;
          padding: 13px 18px;
          border-radius: 14px;
          border: 2px solid #d0e1fd;
          background: #f6fbff;
          margin-bottom: 20px;
          box-sizing: border-box;
        }
          
        input.form-control:focus {
          outline: none;
          border-color: #3f6feb;
          background: #edf5ff;
        }

        button.btn-primary {
          background: linear-gradient(135deg, #4d94ff, #3366cc);
          border: none;
          font-size: 1.2rem;
          padding: 14px;
          font-weight: 700;
          border-radius: 18px;
          color: white;
          cursor: pointer;
          width: 100%;
          transition: transform 0.2s;
        }

        button.btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(51, 102, 204, 0.4);
        }

        .text-center { text-align: center; margin-top: 20px; color: #4567ad; }
        .text-center a { color: #3385ff; font-weight: 700; text-decoration: none; }
      `}</style>

      <div className="registration-container">
        <div className="registration-box">
          <h2 className="registration-header">Register</h2>
          <form onSubmit={handleSubmit}>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label className="form-label">Phone Number</label>
            <input
              type="text"
              name="number"
              className="form-control"
              placeholder="Phone number"
              value={formData.number}
              onChange={handleChange}
              required
            />

            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Min 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />

            <button type="submit" className="btn-primary">
              Create Account
            </button>
          </form>

          <p className="text-center">
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Registration;