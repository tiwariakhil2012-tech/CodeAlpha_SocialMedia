import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Post({ postId, username, content, postImage, onDelete, initialLikes = [], currentUserId }) {
  const [likes, setLikes] = useState(initialLikes);
  
  
const isLiked = likes.some(like => {
  const likedUserId = like.user?._id || like.user; // Handles both populated and unpopulated data
  return likedUserId?.toString() === currentUserId?.toString();
});

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const displayUsername = typeof username === 'object' ? (username.name || "User") : username;
  const displayContent = typeof content === 'object' ? content.text : content;

  // --- DELETE FUNCTION ---
  const handleDelete = async () => {
    if (!postId || postId === "undefined") {
      console.error("Delete failed: No postId provided.");
      alert("This post cannot be deleted because it has no ID.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this post permanently?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
          headers: { 'x-auth-token': token }
        });
        
        if (onDelete) onDelete(postId);
        alert("Post deleted successfully");
      } catch (err) {
        console.error("Delete failed", err);
        alert("You can only delete your own posts!");
      }
    }
  };

  // --- LIKE FUNCTION ---
const handleLike = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert("You must be logged in to like posts!");
      return;
    }

    const res = await axios.put(
      `http://localhost:5000/api/posts/like/${postId}`, 
      {}, 
      {
        headers: { 
          'x-auth-token': token 
        }
      }
    );
    
    setLikes(res.data); 
  } catch (err) {
    console.error("Error liking post", err);
  }
};

  const handleAddComment = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      setComments([...comments, commentText]);
      setCommentText("");
    }
  };

  return (
    <div className="post-card" style={{ border: '1px solid #dbdbdb', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#fff', overflow: 'hidden' }}>
      
      {/* 1. Header */}
      <div className="post-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            width: '32px', height: '32px', borderRadius: '50%', 
            background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', 
            marginRight: '10px' 
          }}></div>
          <span style={{ fontWeight: '600', fontSize: '14px' }}>{displayUsername}</span>
        </div>
        
        <button 
          onClick={handleDelete}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          title="Delete Post"
        >
          <i className="fa-solid fa-trash-can text-danger" style={{ fontSize: '16px' }}></i>
        </button>
      </div>

      {/* 2. Main Media */}
      {postImage && (
        <div className="post-image-container" style={{ width: '100%', backgroundColor: '#000', display: 'flex', justifyContent: 'center' }}>
          <img 
            src={`http://localhost:5000${postImage.startsWith('/') ? '' : '/'}${postImage}`} 
            alt="post" 
            style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain', display: 'block' }} 
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      )}

      {/* 3. Action Bar */}
      <div className="post-actions" style={{ padding: '8px 16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <button onClick={handleLike} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0' }}>
          {/* Like Unlike */}
          <i className={`${isLiked ? 'fa-solid fa-heart text-danger' : 'fa-regular fa-heart'}`} style={{ fontSize: '24px' }}></i>
        </button>
        <button onClick={() => setShowComments(!showComments)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0' }}>
          <i className="fa-regular fa-comment" style={{ fontSize: '24px' }}></i>
        </button>
      </div>

      {/* 4. Likes Count (Using array length) */}
      <div style={{ padding: '0 16px', fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
        {likes.length.toLocaleString()} likes
      </div>

      {/* 5. Caption */}
      <div className="post-content" style={{ padding: '0 16px 12px 16px', fontSize: '14px', lineHeight: '1.4' }}>
        <span style={{ fontWeight: '600', marginRight: '8px' }}>{displayUsername}</span>
        {displayContent}
      </div>

      {/* 6. Comments Section */}
      {showComments && (
        <div className="comment-section" style={{ borderTop: '1px solid #efefef', padding: '12px 16px' }}>
          <div className="comments-list" style={{ marginBottom: '12px', maxHeight: '150px', overflowY: 'auto' }}>
            {comments.map((c, index) => (
              <div key={index} style={{ fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ fontWeight: '600', marginRight: '6px' }}>You</span> {c}
              </div>
            ))}
          </div>
          <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" placeholder="Add a comment..." value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px' }}
            />
            <button type="submit" disabled={!commentText.trim()} style={{ background: 'none', border: 'none', color: '#0095f6', fontWeight: '600', cursor: 'pointer' }}>
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Post;