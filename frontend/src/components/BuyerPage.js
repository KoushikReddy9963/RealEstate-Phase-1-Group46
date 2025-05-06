import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import authService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from '../styles/commonStyles';
import { FaHeart, FaRegHeart, FaSignOutAlt, FaShoppingCart, FaMapMarkerAlt, FaRupeeSign, FaInfoCircle, FaEnvelope, FaCalendarAlt, FaHome, FaStar } from 'react-icons/fa';
import estateAgent from '../assets/estate-agent.png';
import house from '../assets/house.png';
import property from '../assets/property.png';
import search from '../assets/search.png';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PageWrapper = styled.div`
  background-color: ${colors.background};
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  overflow: hidden;
`;

const BackgroundImage = styled.img`
  position: absolute;
  opacity: 0.4;
  z-index: 0;
  width: 29%;
  height: 45%;
  ${({ position }) => position}: 0;
  ${({ size }) => size}: 150px;
`;

const Container = styled.div`
  min-width: 100vh;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 1;
`;

const Heading = styled.h1`
  color: ${colors.primary};
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
`;

const StyledHeading = styled.h2`
  color: ${colors.primary};
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  svg {
    color: ${colors.secondary};
    font-size: 2.2rem;
  }

  animation: fadeIn 0.5s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const TabButton = styled.button`
  padding: 8px 16px;
  margin: 0 8px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  background: ${props => props.active ? colors.primary : colors.neutral};
  color: ${props => props.active ? 'white' : '#333'};

  &:hover {
    background: ${props => props.active ? colors.secondary : colors.accent};
  }
`;

const FilterSection = styled.div`
  background-color: ${colors.cardBg};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
`;

const FilterTitle = styled.h3`
  color: ${colors.primary};
  font-size: 1.5rem;
  margin-bottom: 1rem;
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

const PropertyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
  padding: 20px;
`;

const PropertyCard = styled.div`
  position: relative;
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  padding: 25px;
  margin-bottom: 25px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.05);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.15);
    border-color: ${colors.accent}40;
  }

  img {
    width: 100%;
    height: 250px !important;
    object-fit: cover;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
`;

const StatusBadge = styled.span`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 1.3rem;
  font-weight: 600;
  background-color: ${props => 
    props.status === 'available' ? `${colors.primary}` :
    props.status === 'pending' ? `${colors.secondary}` :
    `${colors.error}`};
  color: white;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  z-index: 2;
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 8px;
  width: 45px;
  height: 45px;
  background: ${props => props.isFavorite ? colors.secondary : 'white'};
  border: 2px solid ${props => props.isFavorite ? colors.secondary : '#ccc'};
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  transition: all 0.3s ease;
  z-index: 2;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 12px rgba(0,0,0,0.2);
    background: ${props => props.isFavorite ? colors.secondary : '#f8f8f8'};
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    color: ${props => props.isFavorite ? 'white' : colors.secondary};
  }
`;

const LogoutButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 12px 24px;
  background: ${colors.secondary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.4rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  z-index: 10;

  &:hover {
    background: #9B2C2C;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    font-size: 1.6rem;
  }
`;

const BuyButton = styled.button`
  padding: 12px 24px;
  background: ${colors.accent};
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.6rem;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);

  &:hover {
    background: ${colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    font-size: 1.8rem;
  }
`;

const PropertyDetails = styled.div`
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const PropertyTitle = styled.h3`
  color: ${colors.primary};
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 20px;
  border-bottom: 3px solid ${colors.accent};
  padding-bottom: 12px;
  letter-spacing: 0.5px;
`;

const PropertyInfo = styled.p`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.4rem;
  margin: 16px 0;
  color: ${colors.neutral};
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.background};
  }

  svg {
    color: ${colors.secondary};
    min-width: 24px;
    font-size: 1.6rem;
  }

  strong {
    color: ${colors.primary};
    margin-right: 8px;
    font-weight: 600;
  }

  span {
    flex: 1;
  }
`;

const NoProperties = styled.div`
  text-align: center;
  font-size: 1.8rem;
  color: ${colors.primary};
  margin: 40px 0;
  padding: 40px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);

  &::before {
    content: '🏠';
    display: block;
    font-size: 3rem;
    margin-bottom: 15px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
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
  const dispatch = useDispatch();

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.target);
      const newFilters = {};
      formData.forEach((value, key) => {
        if (value) { 
          newFilters[key] = value;
        }
      });
      
      setFilters(newFilters);
      await applyFilters();
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setLoading(false);
    }
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
        `https://realestate-9evw.onrender.com/api/buyer/properties?${queryParams.toString()}`,
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
      const response = await axios.get('https://realestate-9evw.onrender.com/api/buyer/favorites', {
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
      const response = await axios.get('https://realestate-9evw.onrender.com/api/buyer/purchased', {
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
        await axios.delete(`https://realestate-9evw.onrender.com/api/buyer/favorites/${propertyId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(favorites.filter(fav => fav._id !== propertyId));
      } else {
        await axios.post('https://realestate-9evw.onrender.com/api/buyer/favorites', 
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
      const response = await axios.post(
        'https://realestate-9evw.onrender.com/api/buyer/purchase',
        {
          propertyId,
          price,
          title,
          status: 'sold'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Stripe response:', response.data);

      if (response.data && response.data.paymentUrl) {
        setProperties(prevProperties => 
          prevProperties.map(prop => 
            prop._id === propertyId ? { ...prop, status: 'sold' } : prop
          )
        );
        
        window.location.href = response.data.paymentUrl;
      } else {
        console.error('Invalid Stripe response:', response.data);
        toast.error('Failed to initiate payment: Invalid response from server');
      }
    } catch (error) {
      console.error('Purchase initiation failed:', error);
      toast.error(error.response?.data?.message || 'Failed to initiate purchase');
    }
  };

  useEffect(() => {
    if (activeTab === 'favorites') {
      fetchFavorites();
    } else if (activeTab === 'purchased') {
      fetchPurchasedProperties();
    } else {
      const fetchInitialProperties = async () => {
        setLoading(true);
        try {
          const token = authService.getToken();
          const response = await axios.get(
            'https://realestate-9evw.onrender.com/api/buyer/properties',
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setProperties(response.data);
        } catch (error) {
          console.error('Error fetching properties:', error);
          toast.error('Failed to fetch properties');
        } finally {
          setLoading(false);
        }
      };
      fetchInitialProperties();
    }
  }, [activeTab, fetchFavorites, fetchPurchasedProperties]);

  const renderProperties = () => {
    const propertiesToShow = activeTab === 'favorites' 
      ? favorites 
      : activeTab === 'purchased' 
        ? purchasedProperties 
        : properties;

    if (propertiesToShow.length === 0) {
      return (
        <NoProperties>
          No properties found
        </NoProperties>
      );
    }

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
                {favorites.some(fav => fav._id === property._id) ? <FaHeart /> : <FaRegHeart />}
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
            
            <PropertyDetails>
              <PropertyTitle>
                {property.title || 'Untitled Property'}
              </PropertyTitle>
              
              <PropertyInfo>
                <FaMapMarkerAlt />
                <span><strong>Location:</strong> {property.location || 'Not available'}</span>
              </PropertyInfo>
              
              <PropertyInfo>
                <FaRupeeSign />
                <span><strong>Price:</strong> {property.price ? `₹${property.price.toLocaleString()}` : 'Price not available'}</span>
              </PropertyInfo>
              
              <PropertyInfo>
                <FaInfoCircle />
                <span><strong>Description:</strong> {property.description || 'No description provided'}</span>
              </PropertyInfo>
              
              <PropertyInfo>
                <FaEnvelope />
                <span><strong>Contact:</strong> {property.userEmail || 'Email not provided'}</span>
              </PropertyInfo>
              
              <PropertyInfo>
                <FaCalendarAlt />
                <span><strong>Listed on:</strong> {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'Not available'}</span>
              </PropertyInfo>
              
              {property.status === 'available' && activeTab !== 'purchased' && (
                <BuyButton 
                  onClick={() => handlePurchase(
                    property._id,
                    property.price,
                    property.title
                  )}
                >
                  <FaShoppingCart /> Buy Property
                </BuyButton>
              )}
            </PropertyDetails>
          </PropertyCard>
        ))}
      </PropertyGrid>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    dispatch(logoutUser());
    navigate('/');
  };

  const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata'];

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      location: '',
      propertyType: '',
      minBedrooms: '',
      minBathrooms: '',
      minArea: '',
      maxArea: '',
      amenities: []
    });

    const filterForm = document.querySelector('form');
    if (filterForm) {
      filterForm.reset();
    }
    applyFilters({});
  };

  return (
    <PageWrapper>

      <BackgroundImage src={estateAgent} position="top" size="left" />
      <BackgroundImage src={house} position="bottom" size="right" />
      <BackgroundImage src={property} position="top" size="right" />
      <BackgroundImage src={search} position="bottom" size="left" />

      <LogoutButton onClick={handleLogout}>
        <FaSignOutAlt />
        Logout
      </LogoutButton>
      <Container>
        <Heading>Estate Craft Properties</Heading>
        <StyledHeading>
          <FaStar />
          ...Find your dream home with us....
          <FaHome />
        </StyledHeading>
        <TabContainer>
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
        </TabContainer>

        {activeTab === 'available' && (
          <FilterSection>
            <FilterTitle>Filter Properties</FilterTitle>
            <form onSubmit={handleFilterSubmit}>
              <FilterGrid>
                <Input
                  type="text"
                  name="title"
                  placeholder="Search by title"
                  defaultValue={filters.title || ''}
                />
                <Input
                  type="number"
                  name="minPrice"
                  placeholder="Min Price"
                  defaultValue={filters.minPrice}
                />
                <Input
                  type="number"
                  name="maxPrice"
                  placeholder="Max Price"
                  defaultValue={filters.maxPrice}
                />
                <Select
                  name="location"
                  defaultValue={filters.location}
                >
                  <option value="">All Locations</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </Select>
                <Select
                  name="propertyType"
                  defaultValue={filters.propertyType}
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
                  defaultValue={filters.minBedrooms}
                />
                <Input
                  type="number"
                  name="minBathrooms"
                  placeholder="Min Bathrooms"
                  defaultValue={filters.minBathrooms}
                />
                <Input
                  type="number"
                  name="minArea"
                  placeholder="Min Area (sq ft)"
                  defaultValue={filters.minArea}
                />
                <Input
                  type="number"
                  name="maxArea"
                  placeholder="Max Area (sq ft)"
                  defaultValue={filters.maxArea}
                />
              </FilterGrid>
              <ButtonGroup>
                <TabButton type="button" onClick={clearFilters}>Clear Filters</TabButton>
                <TabButton type="submit" active>Apply Filters</TabButton>
              </ButtonGroup>
            </form>
            {loading && (
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                Loading properties...
              </div>
            )}
          </FilterSection>
        )}
        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : (
          renderProperties()
        )}
      </Container>
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          © 2024 Real Estate Portal | All rights reserved
        </div>
      </footer>
    </PageWrapper>
  );
};

export default BuyerPage;

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
  },
  noProperties: {
    textAlign: 'center',
    fontSize: '1.5rem',
    color: colors.primary,
    marginTop: '2rem',
  },
};