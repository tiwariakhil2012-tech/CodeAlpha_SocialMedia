import React, { useState, useEffect } from 'react'; 
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios'; 
import Post from './components/Post';
import CreatePost from './components/CreatePost';
import Dashboard from './components/Dashboard';
import './App.css';
import Login from './components/Login';
import Registration from './components/Registration';
import ChangePassword from './components/ChangePassword';
import Message from './components/Message';

const SocialFeed = ({ posts, setPosts, viewType, currentUserId }) => {
  const displayPosts = viewType === "profile" 
    ? posts.filter(p => {
        const postUserId = p.user?._id || p.user;
        return String(postUserId) === String(currentUserId);
      }) 
    : posts;

  const handleDeleteUI = (id) => {
    setPosts(prevPosts => prevPosts.filter(p => (p._id || p.id) !== id));
  };

  return (
    <div className="feed-outer-wrapper">
      {viewType === "feed" && (
        <CreatePost onAddPost={(newPost) => setPosts([newPost, ...posts])} />
      )}
      
      {displayPosts.length > 0 ? (
        displayPosts.map(post => (
          <Post 
            key={post._id} 
            postId={post._id} 
            username={post.user} 
            content={post.text} 
            postImage={post.image} 
            initialLikes={post.likes || []} 
            currentUserId={currentUserId} 
            onDelete={handleDeleteUI}
          />
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: '#8e8e8e' }}>
          <p>No posts found here!</p>
        </div>
      )}
    </div>
  );
};

function App() {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  useEffect(() => {
    const handleStorageChange = () => {
      setUserId(localStorage.getItem('userId'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const loadAppData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/posts');
        setPosts(res.data);
      } catch (err) {
        console.error("Error loading app data:", err);
      }
    };
    loadAppData();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />

        <Route path="/user" element={<Dashboard />}>
          <Route 
            path="feed" 
            element={<SocialFeed posts={posts} setPosts={setPosts} viewType="feed" currentUserId={userId} />} 
          />
          <Route 
            path="profile" 
            element={<SocialFeed posts={posts} setPosts={setPosts} viewType="profile" currentUserId={userId} />} 
          />
          
          <Route path="message" element={<Message />} />
          <Route path="changepassword" element={<ChangePassword />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/user/feed" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;