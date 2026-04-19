import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const tableStyles = {
  tableContainerOuter: {
    margin: "22px auto 0 auto",
    background: "linear-gradient(130deg, #a3c6ffdd 65%, #e5f0ffdd 100%)",
    borderRadius: "18px",
    padding: "26px 24px",
    boxShadow: "inset 5px 5px 100px 20px #b9d9ff88",
    overflowX: "auto",
    maxWidth: "900px",
    width: "100%",
  },
  table: {
    width: "100%",
    color: "#204a87",
    borderCollapse: "collapse",
    fontSize: "1.05rem",
    minWidth: "650px",
    borderRadius: "8px 8px 0 0"
  },
  th: {
    padding: "14px",
    fontWeight: "600",
    fontSize: "1.1rem",
    textAlign: "left",
    borderBottom: "2.5px solid #94b9ff",
    color: "#1a3e72",
    letterSpacing: ".1px"
  },
  td: {
    padding: "13px 10px",
    borderBottom: "1.5px solid #c4d7f7",
    textAlign: "left",
    background: "rgba(255,255,255,0.15)",
    fontSize: "1.07rem",
    color: "#346baa"
  },
};

const Message = () => {
  const currentUserId = localStorage.getItem('userId');
  const [formData, setFormData] = useState({
    question: '',
    email: '' 
  });
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/message/${currentUserId}`, {
        headers: { 'x-auth-token': token }
      });
      setMessages(response.data.message || []);
    } catch (error) {
      setMessages([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/message', formData, {
        headers: { 'x-auth-token': token }
      });
      alert(response.data.message);
      setFormData({ question: '', email: '' });
      fetchMessages();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send message');
    }
  };

  const handleReplySubmit = async (messageId) => {
    if (!replyText[messageId]) return alert("Please type a reply first");
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/message/reply/${messageId}`,
        { reply: replyText[messageId] },
        { headers: { 'x-auth-token': token } }
      );
      alert(response.data.message);
      setReplyText(prev => ({ ...prev, [messageId]: '' }));
      fetchMessages();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send reply');
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div
      className="d-flex flex-column align-items-center"
      style={{
        background: 'linear-gradient(135deg, #c7dfff, #e8f0ff, #c7dfff)',
        position: 'relative',
        padding: '20px',
        width: '100%',
        minHeight: '100vh',
        boxSizing: 'border-box',
      }}
    >
      {/* Glass Blur Overlay */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(222,231,255,0.5)',
          zIndex: 0,
        }}
      />
      
      {/* Main Content Wrapper */}
      <div 
        className="position-relative z-1" 
        style={{ maxWidth: '650px', width: '100%', marginTop: "40px", marginBottom: "40px", padding: '0 10px' }}
      >
        <div
          className="p-4 rounded-4 shadow-lg"
          style={{
            background: 'rgba(240, 248, 255, 0.75)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(150, 180, 255, 0.7)',
            color: '#1c3d7a',
          }}
        >
          <h2 className="text-center mb-4" style={{ color: '#1a3e72' }}>
            <i className="bi bi-envelope-fill me-2"></i> Contact Us
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ color: '#2e4c81' }}>Recipient Email</label>
              <input
                type="email"
                name="email"
                className="form-control mb-3"
                placeholder="user@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ background: 'rgba(230, 240, 255, 0.8)', border: 'none', borderRadius: '10px' }}
              />
              <label className="form-label fw-semibold" style={{ color: '#2e4c81' }}>Message</label>
              <textarea
                className="form-control"
                name="question"
                rows="4"
                placeholder="Write your message here..."
                value={formData.question}
                onChange={handleChange}
                required
                style={{ background: 'rgba(230, 240, 255, 0.8)', border: 'none', borderRadius: '10px', boxShadow: 'inset 0 0 8px #a9c3ffcc' }}
              />
            </div>
            <button
              type="submit"
              className="btn fw-bold w-100"
              style={{ background: 'linear-gradient(180deg, #a9c3ff, #6c8ced)', border: 'none', borderRadius: '10px', padding: '10px', color: 'white' }}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Messages Table Card */}
      <div 
        className="position-relative z-1" 
        style={{ maxWidth: "900px", width: '100%', marginBottom: '40px', padding: '0 10px' }}
      >
        <div style={tableStyles.tableContainerOuter}>
          <h3 style={{ color: "#1a3e72", marginBottom: 18, fontWeight: "bold" }}>
            <i className="bi bi-chat-dots me-2"></i> Conversation History
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyles.table}>
              <thead>
                <tr>
                  <th style={tableStyles.th}>Status</th>
                  <th style={tableStyles.th}>Message Details</th>
                  <th style={tableStyles.th}>Date</th>
                  <th style={tableStyles.th}>Reply</th>
                </tr>
              </thead>
              <tbody>
                {messages.length > 0 ? messages.map((msg, index) => {
                  const isRecipient = msg.recipient === currentUserId;
                  return (
                    <tr key={msg._id}>
                      <td style={tableStyles.td}>
                        <span className={`badge ${isRecipient ? 'bg-info' : 'bg-primary'}`} style={{ fontSize: '0.75rem' }}>
                          {isRecipient ? 'Received' : 'Sent'}
                        </span>
                      </td>
                      <td style={tableStyles.td}>
                        <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                          {isRecipient ? `From: ${msg.senderEmail}` : `To: ${msg.email}`}
                        </div>
                        {msg.question}
                      </td>
                      <td style={tableStyles.td}>{new Date(msg.createdAt).toLocaleDateString()}</td>
                      <td style={tableStyles.td}>
                        {msg.reply ? (
                          <div style={{ color: '#157347', fontWeight: 'bold' }}>{msg.reply}</div>
                        ) : isRecipient ? (
                          <div className="d-flex gap-1">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Reply..."
                              style={{ borderRadius: '8px', fontSize: '0.8rem' }}
                              value={replyText[msg._id] || ''}
                              onChange={(e) => setReplyText({ ...replyText, [msg._id]: e.target.value })}
                            />
                            <button className="btn btn-sm btn-success" onClick={() => handleReplySubmit(msg._id)}>Reply</button>
                          </div>
                        ) : (
                          <span className="text-muted small italic">Waiting...</span>
                        )}
                      </td>
                    </tr>
                  );
                }) : (
                  <tr><td style={tableStyles.td} colSpan={4} align="center">No messages yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;