import React, { useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

const BuyerPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = authService.getToken(); // Get token from authService
        const response = await axios.get('http://localhost:5000/api/buyer/properties', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProperties(response.data); // Assuming array of objects
        setLoading(false);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
};
  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
      <button
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#1e3a8a",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    fontWeight: "bold",
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#3b82f6"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
                onClick={handleLogout}
            >
                Logout
            </button>
        <h1 style={styles.heading}>Available Properties</h1>
        <div style={styles.gridContainer}>
          {properties.length > 0 ? (
            properties.map((property) => (
              <div key={property._id} style={styles.propertyCard}>
                {property.image ? (
                  <img
                    src={`data:image/jpeg;base64,${property.image}`} // Assuming image is base64
                    alt="Property"
                    style={styles.propertyImage}
                  />
                ) : (
                  <div style={styles.noImage}>No Image Available</div>
                )}
                <div style={styles.propertyDetails}>
                  <h3 style={styles.propertyTitle}>
                    {property.title || 'Untitled Property'}
                  </h3>
                  <p>
                    <strong>Location:</strong> {property.location || 'Not available'}
                  </p>
                  <p>
                    <strong>Price:</strong> {property.price ? `₹${property.price}` : 'Price not available'}
                  </p>
                  <p>
                    <strong>Description:</strong> {property.description || 'No description provided'}
                  </p>
                  <p>
                    <strong>Contact:</strong> {property.userEmail || 'Email not provided'}
                  </p>
                  <p>
                    <strong>Listed on:</strong>{' '}
                    {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'Not available'}
                  </p>
                  <p>
                    <strong>Available</strong>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No properties available at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerPage;

// Inline CSS styles
const styles = {
  page: {
    backgroundColor: 'white', // Ensure the entire page is white
    minHeight: '100vh', // Full height of the viewport
    padding: '0',
    margin: '0',
  },
  container: {
    margin: '20px auto',
    maxWidth: '1200px',
    padding: '20px',
    backgroundColor: 'white', // Matching the page background color
    borderRadius: '10px',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
    fontSize: '28px', // Increase heading size for better visibility
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  propertyCard: {
    border: '1px solid #ddd',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, background 0.3s ease',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent background
    backdropFilter: 'blur(10px)', // Adds a blurred background effect
    textAlign: 'center',
    width: '100%',
    cursor: 'pointer',
    ':hover': {
      transform: 'scale(1.2)',
      background: 'linear-gradient(135deg, #e6f7ff, #ffdfc6, #b3e0ff)',
    },
  },
  propertyImage: {
    width: '100%',
    height: 'auto',
    maxWidth: '200px', // Reduced the size of the image
    maxHeight: '200px', // Reduced the size of the image
    objectFit: 'contain',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    display: 'block',
    margin: '0 auto',
  },
  noImage: {
    width: '100%',
    height: '200px', // Adjusted height for "No Image Available"
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    color: '#888',
  },
  propertyDetails: {
    padding: '15px',
    textAlign: 'left',
    fontSize: '16px', // Increased text size for better readability
    lineHeight: '1.8', // Increased line-height (gap between lines)
  },
  propertyTitle: {
    fontSize: '20px', // Increased the title size
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#007BFF',
    textAlign: 'center', // Centering the title
  },
  loading: {
    textAlign: 'center',
    fontSize: '24px',
    marginTop: '50px',
  },
};