import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = () => {
  const email = localStorage.getItem('userEmail') || '';
  const [data, setData] = useState({
    op: '',
    np: '',
    cnp: '',
    email: email,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.op || !data.np || !data.cnp) {
      alert('Please fill in all password fields');
      return;
    }
    if (data.np !== data.cnp) {
      alert('New password and confirm password do not match');
      return;
    }
    if (data.op === data.np) {
      alert('New password must be different from old password');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const res = await axios.put(
        'http://localhost:5000/api/change', 
        data,
        {
          headers: {
            'x-auth-token': token 
          }
        }
      );

      if (res.status === 200 && res.data.success) {
        alert(res.data.message);
        // Clear form
        setData({ op: '', np: '', cnp: '', email: email });
      } else {
        alert(res.data.message || 'Could not change password');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert('Sorry, an error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="container">
      <style>{`
        .container {
          max-width: 450px;
          margin: 4rem auto;
          background: rgba(255 255 255 / 0.75);
          padding: 36px 28px;
          border-radius: 24px;
          box-shadow:
            0 20px 50px rgba(100, 150, 255, 0.15),
            inset 0 0 40px rgba(160, 190, 255, 0.28);
          font-family: 'Poppins', sans-serif;
          color: #1e3e6e;
          user-select: none;
        }
        h4 {
          margin-bottom: 2rem;
          font-weight: 700;
          font-size: 1.6rem;
          text-align: center;
          color: #1a337e;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        label {
          font-weight: 600;
          font-size: 1rem;
          color: #2c4a7c;
          user-select: text;
        }
        input.form-control {
          background-color: rgba(255 255 255 / 0.9);
          border: 2.5px solid #a3bee9;
          border-radius: 18px;
          padding: 14px 18px;
          font-size: 1.05rem;
          color: #1f3e70;
          box-shadow:
            inset 3px 3px 12px rgba(255 255 255 / 0.95),
            inset -3px -3px 12px rgba(160 190 250 / 0.75);
          outline: none;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        input.form-control:focus {
          border-color: #4b82ff;
          box-shadow:
            0 0 10px 3px #4b8aff,
            inset 2px 2px 14px rgba(255 255 255 / 1);
          background-color: #f0f6ff;
          color: #1355c1;
        }
        button.btn-primary {
          background: linear-gradient(135deg, #6294f7 0%, #3679f8 90%);
          color: white;
          border: none;
          border-radius: 26px;
          padding: 16px 0;
          font-weight: 700;
          font-size: 1.15rem;
          cursor: pointer;
          box-shadow: 0 12px 30px rgba(38, 88, 255, 0.85);
          user-select: none;
          transition: background 0.3s ease, transform 0.2s ease;
          width: 100%;
        }
        button.btn-primary:hover {
          background: linear-gradient(135deg, #3a6df8 0%, #2e65f7 100%);
          box-shadow: 0 16px 42px rgba(32, 80, 245, 0.95);
          transform: scale(1.06);
        }
        @media (max-width: 480px) {
          .container {
            margin: 2rem 1rem;
            padding: 28px 20px;
          }
          input.form-control {
            font-size: 1rem;
            padding: 12px 14px;
          }
          button.btn-primary {
            font-size: 1rem;
            padding: 14px 0;
          }
        }
      `}</style>

      <h4>Change Password</h4>
      <form onSubmit={handleSubmit}>
        <label htmlFor="op">Current Password</label>
        <input
          type="password"
          id="op"
          name="op"
          className="form-control"
          value={data.op}
          onChange={handleChange}
          required
          autoComplete="current-password"
          placeholder="Enter current password"
        />

        <label htmlFor="np">New Password</label>
        <input
          type="password"
          id="np"
          name="np"
          className="form-control"
          value={data.np}
          onChange={handleChange}
          required
          autoComplete="new-password"
          placeholder="Enter new password"
        />

        <label htmlFor="cnp">Confirm New Password</label>
        <input
          type="password"
          id="cnp"
          name="cnp"
          className="form-control"
          value={data.cnp}
          onChange={handleChange}
          required
          autoComplete="new-password"
          placeholder="Confirm new password"
        />

        <button type="submit" className="btn btn-primary">Update Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;