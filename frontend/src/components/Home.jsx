import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      // If no token, redirect to login
      if (!token) {
        navigate('/');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/auth', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUserData(data.user);
        } else {
          // Token is invalid or expired
          setMessage(data.message || 'Authentication failed');
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      } catch (error) {
        setMessage('Network error. Please try again.');
        console.error('Auth error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="home-container">
        <div className="home-box">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="home-container">
        <div className="home-box">
          <p className="message error">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-box">
        <h1 className="home-title">Welcome to Protected Home Page</h1>
        
        {userData && (
          <div className="user-info">
            <h2>User Information</h2>
            <p><strong>Username:</strong> {userData.username}</p>
            <p><strong>User ID:</strong> {userData.id}</p>
            <p><strong>Account Created:</strong> {new Date(userData.createdAt).toLocaleDateString()}</p>
          </div>
        )}

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>

        <div className="protected-message">
          <p>✅ This is a protected route. You can only see this page because you have a valid JWT token.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;