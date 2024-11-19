import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import authService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from '../styles/commonStyles';

const FilterContainer = styled.div`
  background-color: ${colors.cardBg};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  font-size: 1.5rem;
  width: 100%;
  transition: all 0.3s ease;
  background-color: white;

  &:focus {
    border-color: ${colors.accent};
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
    outline: none;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  font-size: 1.5rem;
  width: 100%;
  transition: all 0.3s ease;
  background-color: white;

  &:focus {
    border-color: ${colors.accent};
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
    outline: none;
  }
`;

const BuyerPage = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [purchasedProperties, setPurchasedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    location: '',
    propertyType: '',
    minBedrooms: '',
    minBathrooms: '',
    minArea: '',
    maxArea: '',
  });

  const navigate = useNavigate();

  const TabButton = styled.button`
    padding: 8px 16px;
    margin: 0 8px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 1.5rem;
    transition: all 0.3s ease;
    background: ${props => props.active ? '#007bff' : '#e9ecef'};
    color: ${props => props.active ? 'white' : '#333'};

    &:hover {
      background: ${props => props.active ? '#0056b3' : '#dee2e6'};
    }
  `;

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = useCallback(async () => {
    setLoading(true);
    try {
      const token = authService.getToken();
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await axios.get(
        `http://localhost:5000/api/buyer/properties?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching filtered properties:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchFavorites = useCallback(async () => {
    try {
      const token = authService.getToken();
      const response = await axios.get('http://localhost:5000/api/buyer/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  }, []);

  const fetchPurchasedProperties = useCallback(async () => {
    try {
      const token = authService.getToken();
      const response = await axios.get('http://localhost:5000/api/buyer/purchased', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPurchasedProperties(response.data);
    } catch (error) {
      console.error('Error fetching purchased properties:', error);
    }
  }, []);

  const toggleFavorite = async (propertyId) => {
    try {
      const token = authService.getToken();
      const isFavorite = favorites.some(fav => fav._id === propertyId);
      
      if (isFavorite) {
        await axios.delete(`http://localhost:5000/api/buyer/favorites/${propertyId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(favorites.filter(fav => fav._id !== propertyId));
      } else {
        await axios.post('http://localhost:5000/api/buyer/favorites', 
          { propertyId },
          { headers: { Authorization: `Bearer ${token}` }}
        );
        const property = properties.find(p => p._id === propertyId);
        setFavorites([...favorites, property]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handlePurchase = async (propertyId, price, title) => {
    try {
      const token = authService.getToken();
      const data = {
        amount: price * 100,
        currency: 'inr',
        product: title,
        propertyId: propertyId
      };

      const response = await axios.post(
        'http://localhost:5000/api/buyer/purchase',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data && response.data.paymentUrl) {
        localStorage.setItem('purchaseFlag', response.data.flag);
        window.location.href = response.data.paymentUrl;
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error) {
      console.error('Purchase payment failed:', error);
      alert('Failed to initiate payment. Please try again.');
    }
  };

  useEffect(() => {
    if (activeTab === 'favorites') {
      fetchFavorites();
    } else if (activeTab === 'purchased') {
      fetchPurchasedProperties();
    } else {
      applyFilters();
    }
  }, [activeTab, applyFilters, fetchFavorites, fetchPurchasedProperties]);

  const renderProperties = () => {
    const propertiesToShow = activeTab === 'favorites' 
      ? favorites 
      : activeTab === 'purchased' 
        ? purchasedProperties 
        : properties;

    return (
      <PropertyGrid>
        {propertiesToShow.map((property) => (
          <PropertyCard key={property._id}>
            <StatusBadge status={property.status || 'available'}>
              {property.status ? property.status.charAt(0).toUpperCase() + property.status.slice(1) : 'Available'}
            </StatusBadge>
            
            {activeTab !== 'purchased' && (
              <FavoriteButton 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(property._id);
                }}
                isFavorite={favorites.some(fav => fav._id === property._id)}
              >
                {favorites.some(fav => fav._id === property._id) ? '❤️' : '🤍'}
              </FavoriteButton>
            )}

            {property.image && (
              <img
                src={`data:image/jpeg;base64,${property.image}`}
                alt={property.title}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '15px'
                }}
              />
            )}
            
            <div style={styles.propertyDetails}>
              <h3 style={styles.propertyTitle}>
                {property.title || 'Untitled Property'}
              </h3>
              <p><strong>Location:</strong> {property.location || 'Not available'}</p>
              <p><strong>Price:</strong> {property.price ? `₹${property.price}` : 'Price not available'}</p>
              <p><strong>Description:</strong> {property.description || 'No description provided'}</p>
              <p><strong>Contact:</strong> {property.userEmail || 'Email not provided'}</p>
              <p><strong>Listed on:</strong> {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'Not available'}</p>
              {property.status === 'available' && (
                <BuyButton onClick={() => handlePurchase(property._id, property.price, property.title)}>
                  Buy Property
                </BuyButton>
              )}
            </div>
          </PropertyCard>
        ))}
      </PropertyGrid>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const FilterSection = styled(FilterContainer)`
    margin-top: 2rem;
  `;

  const FilterTitle = styled.h3`
    color: ${colors.primary};
    font-size: 1.5rem;
    margin-bottom: 1rem;
  `;

  const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata'];

  const PropertyCard = styled.div`
    position: relative;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 15px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;

    h3 {
      font-size: 1.5rem;
      margin-bottom: 12px;
    }

    p {
      font-size: 1.5rem;
      margin: 8px 0;
      line-height: 1.4;
    }
  `;

  const StatusBadge = styled.span`
    position: absolute;
    bottom: 15px;
    right: 15px;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 1.5em;
    font-weight: 600;
    background-color: ${props => 
      props.status === 'available' ? '#4CAF50' :
      props.status === 'pending' ? '#FFC107' :
      '#F44336'};
    color: white;
  `;

  const PropertyGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px;
  `;

  return (
    <div style={styles.page}>
      <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      <div style={styles.container}>
        <h1 style={styles.heading}>Real Estate Properties</h1>
        
        <div style={styles.tabContainer}>
          <TabButton 
            active={activeTab === 'available'} 
            onClick={() => setActiveTab('available')}
          >
            Available Properties
          </TabButton>
          <TabButton 
            active={activeTab === 'favorites'} 
            onClick={() => setActiveTab('favorites')}
          >
            My Favorites
          </TabButton>
          <TabButton 
            active={activeTab === 'purchased'} 
            onClick={() => setActiveTab('purchased')}
          >
            Purchased Properties
          </TabButton>
        </div>

        {activeTab === 'available' && <FilterSection>
          <FilterTitle>Filter Properties</FilterTitle>
          <FilterGrid>
            <Input
              type="text"
              name="title"
              placeholder="Search by title"
              value={filters.title}
              onChange={handleFilterChange}
            />
            <Input
              type="number"
              name="minPrice"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={handleFilterChange}
            />
            <Input
              type="number"
              name="maxPrice"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={handleFilterChange}
            />
            <Select
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </Select>
            <Select
              name="propertyType"
              value={filters.propertyType}
              onChange={handleFilterChange}
            >
              <option value="">All Property Types</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="land">Land</option>
            </Select>
            <Input
              type="number"
              name="minBedrooms"
              placeholder="Min Bedrooms"
              value={filters.minBedrooms}
              onChange={handleFilterChange}
            />
            <Input
              type="number"
              name="minBathrooms"
              placeholder="Min Bathrooms"
              value={filters.minBathrooms}
              onChange={handleFilterChange}
            />
            <Input
              type="number"
              name="minArea"
              placeholder="Min Area (sq ft)"
              value={filters.minArea}
              onChange={handleFilterChange}
            />
            <Input
              type="number"
              name="maxArea"
              placeholder="Max Area (sq ft)"
              value={filters.maxArea}
              onChange={handleFilterChange}
            />
          </FilterGrid>
        </FilterSection>}
        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : (
          renderProperties()
        )}
      </div>
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          © 2024 Real Estate Portal | All rights reserved
        </div>
      </footer>
    </div>
  );
};

export default BuyerPage;

// Inline CSS styles
const styles = {
  page: {
    backgroundColor: colors.background,
    minHeight: '100vh',
    padding: '2rem',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  propertyCard: {
    backgroundColor: colors.cardBg,
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    transition: 'transform 0.3s ease',
    padding: '1.5rem',
    cursor: 'pointer',
  },
  heading: {
    color: colors.primary,
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  filterSection: {
    backgroundColor: colors.cardBg,
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '2rem',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
  },
  footer: {
    backgroundColor: '#f5f5f5',
    padding: '1rem',
    textAlign: 'center',
    color: '#333',
    fontSize: '0.9rem',
  }, 
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
  }
};

const FavoriteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 6px;
  width: 35px;
  height: 35px;
  background: ${props => props.isFavorite ? '#ff4d4d' : 'white'};
  border: 2px solid ${props => props.isFavorite ? '#ff4d4d' : '#ccc'};
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
  z-index: 2;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    background: ${props => props.isFavorite ? '#ff3333' : '#f8f8f8'};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const LogoutButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #c82333;
  }
`;

const BuyButton = styled.button`
  padding: 8px 16px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  margin-top: 10px;

  &:hover {
    background: #218838;
  }
`;