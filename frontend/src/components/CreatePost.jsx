import React, { useState } from 'react';
import axios from 'axios'; 

function CreatePost({ onAddPost }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null); 
  const [file, setFile] = useState(null);    

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile); 
      const imageUrl = URL.createObjectURL(selectedFile);
      setImage(imageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (text.trim() || file) {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      formData.append('text', text); 
      if (file) {
        formData.append('image', file); 
      }

      try {
        const res = await axios.post('http://localhost:5000/api/posts', formData, {
          headers: {
            'x-auth-token': token
          }
        });

        if (onAddPost) onAddPost(res.data); 

        setText("");  
        setImage(null);
        setFile(null); 
        alert("Post shared!"); 
      } catch (err) {
        console.error("Post failed", err);
        alert("Server error: Could not save post.");
      }
    }
  };

  return (
    <form className="create-post-form" onSubmit={handleSubmit}>
      <textarea 
        placeholder="What's on your mind?" 
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {image && (
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <img 
            src={image} 
            alt="Preview" 
            style={{ width: '100%', borderRadius: '8px', maxHeight: '300px', objectFit: 'cover' }} 
          />
          <button 
            type="button" 
            onClick={() => { setImage(null); setFile(null); }}
            style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <input 
          type="file" 
          id="image-input" 
          accept="image/*" 
          onChange={handleImageChange} 
          style={{ display: 'none' }} 
        />
        
        <label htmlFor="image-input" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#1877f2', fontWeight: '600' }}>
          <span>📷</span> Add Photo
        </label>

        <button type="submit" disabled={!text.trim() && !file}>
          Post
        </button>
      </div>
    </form>
  );
}

export default CreatePost;