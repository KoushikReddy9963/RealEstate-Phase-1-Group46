import React, { useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/AuthService';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to right, #f8f9fa, #e9ecef);
  padding: 20px;
`;

const SellerContainer = styled.div`
  max-width: 800px;
  width: 100%;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SellerHeading = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  color: #1a1a1a;
  font-weight: 600;
`;

const PropertyForm = styled.form`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background-color: white;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
    outline: none;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background-color: white;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
    outline: none;
  }
`;

const Textarea = styled.textarea`
  grid-column: 1 / -1;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  min-height: 100px;
  resize: vertical;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
    outline: none;
  }
`;

const SubmitButton = styled.button`
  grid-column: 1 / -1;
  padding: 14px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #0056b3;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Message = styled.div`
  margin: 10px 0;
  text-align: center;
  font-size: 18px;
  color: #28a745;
`;

const PaymentButton = styled.button`
  padding: 12px 24px;
  margin-top: 20px;
  background: linear-gradient(90deg, #28a745, #218838);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background 0.3s, transform 0.2s, box-shadow 0.2s;
  width: 100%;
  max-width: 300px;
  align-self: center;

  &:hover {
    background: linear-gradient(90deg, #218838, #28a745);
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 4px #28a745;
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

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  gap: 20px;
`;

const TabButton = styled.button`
  padding: 12px 24px;
  background: ${props => props.active ? '#007bff' : '#e9ecef'};
  color: ${props => props.active ? 'white' : '#333'};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? '#0056b3' : '#dee2e6'};
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 18px;
  color: #333;
`;

const PropertiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const PropertyCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const StatusSelect = styled.select`
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background-color: white;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
    outline: none;
  }
`;

const FormSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  width: 100%;
`;

const SellerPage = () => {
  const [view, setView] = useState('add');
  const [myProperties, setMyProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    propertyType: 'house',
    bedrooms: '',
    bathrooms: '',
    area: '',
    amenities: '',
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const makepayment = async () => {

    const token = authService.getToken();
    const data = {
      amount: formData.price * 100,
      currency: 'usd',
      product: formData.title,
    }


    // console.log('data:', data);
  
    try {
      const response = await axios.post('http://localhost:5000/api/seller/payment', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const paymentUrl = response.data.paymentUrl;
      let flag = response.data.flag;
      //set flag in local storae
      localStorage.setItem('flag', flag);
      // window.alert(paymentUrl);
      window.location.href = paymentUrl;


    

    } catch (error) {
      console.error('Payment initiation failed:', error);
      setMessage('Payment initiation failed.');
    }
  };
  




  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    
    // Append all form data
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value);
    });
    if (image) {
      submitData.append('image', image);
    }

    try {
      const token = authService.getToken();
      await axios.post('http://localhost:5000/api/seller/property', submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Property added successfully!');
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        location: '',
        propertyType: 'house',
        bedrooms: '',
        bathrooms: '',
        area: '',
        amenities: '',
      });
      setImage(null);
    } catch (error) {
      setMessage('Failed to add property.');
    }
  };

  const fetchMyProperties = async () => {
    setLoading(true);
    try {
      const token = authService.getToken();
      const response = await axios.get('http://localhost:5000/api/seller/myProperty', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'my-properties') {
      fetchMyProperties();
    }
  }, [view]);

  const updatePropertyStatus = async (propertyId, status) => {
    try {
      const token = authService.getToken();
      await axios.patch('http://localhost:5000/api/seller/property/status',
        { propertyId, status },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      fetchMyProperties();
    } catch (error) {
      console.error('Error updating property status:', error);
    }
  };

  return (
    <AppContainer>
      <LogoutButton onClick={handleLogout}>
        Logout
      </LogoutButton>
      <SellerContainer>
        <SellerHeading>Property Management</SellerHeading>
        
        <TabContainer>
          <TabButton 
            active={view === 'add'} 
            onClick={() => setView('add')}
          >
            Add Property
          </TabButton>
          <TabButton 
            active={view === 'my-properties'} 
            onClick={() => setView('my-properties')}
          >
            My Properties
          </TabButton>
        </TabContainer>

        {view === 'add' ? (
          <FormSection>
            <PropertyForm onSubmit={handleSubmit}>
              <Input
                type="text"
                name="title"
                placeholder="Property Title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              <Input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
              <Select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                required
              >
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="land">Land</option>
              </Select>
              <Input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
              <Input
                type="number"
                name="bedrooms"
                placeholder="Number of Bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
              />
              <Input
                type="number"
                name="bathrooms"
                placeholder="Number of Bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
              />
              <Input
                type="number"
                name="area"
                placeholder="Area (sq ft)"
                value={formData.area}
                onChange={handleInputChange}
                required
              />
              <Input
                type="text"
                name="amenities"
                placeholder="Amenities (e.g., pool, gym, parking)"
                value={formData.amenities}
                onChange={handleInputChange}
              />
              <Textarea
                name="description"
                placeholder="Property Description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                required
              />
              <SubmitButton type="submit">Add Property</SubmitButton>
            </PropertyForm>
          </FormSection>
        ) : (
          loading ? (
            <LoadingMessage>Loading...</LoadingMessage>
          ) : (
            <PropertiesGrid>
              {myProperties.map(property => (
                <PropertyCard key={property._id}>
                  {property.image && (
                    <img 
                      src={`data:image/jpeg;base64,${property.image}`}
                      alt={property.title}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                  )}
                  <h3>{property.title}</h3>
                  <p>Price: ₹{property.price}</p>
                  <p>Location: {property.location}</p>
                  <StatusSelect
                    value={property.status || 'available'}
                    onChange={(e) => updatePropertyStatus(property._id, e.target.value)}
                  >
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="sold">Sold</option>
                  </StatusSelect>
                </PropertyCard>
              ))}
            </PropertiesGrid>
          )
        )}
      </SellerContainer>
      {message && <Message>{message}</Message>}

      {formData.price && (
        <PaymentButton onClick={makepayment}>
          Proceed to Payment
        </PaymentButton>
      )}
    </AppContainer>
  );
};

export default SellerPage;
