import React, { useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/AuthService';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaBuilding, FaQuoteLeft, FaQuoteRight, FaMagic, FaCheckCircle, FaClock, FaBullhorn, FaRedo, FaTrash } from 'react-icons/fa';
import { BiDollar } from 'react-icons/bi';
import { MdAddAPhoto } from 'react-icons/md';
import { GiDreamCatcher } from 'react-icons/gi';
import { colors } from '../styles/AuthStyles';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// Styled components remain unchanged; they are included here for completeness
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
`;

const SellerContainer = styled.div`
  max-width: 1000px;
  width: 100%;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.2);
  animation: slideUp 0.5s ease-out;
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
  gap: 25px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const Input = styled.input`
  width: 100%;
  height: 50px;
  background: rgba(45, 55, 72, 0.1);
  border: 2px solid transparent;
  border-radius: 30px;
  padding: 0 45px;
  font-size: 15px;
  color: ${colors.neutral};
  transition: all 0.3s ease;

  &:focus {
    background: rgba(45, 55, 72, 0.15);
    border-color: ${colors.secondary};
    outline: none;
    box-shadow: 0 0 0 4px rgba(197, 48, 48, 0.1);
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 17px;
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.secondary};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  font-size: 1.2rem;
`;

const Select = styled.select`
  width: 100%;
  height: 50px;
  background: rgba(45, 55, 72, 0.1);
  border: 2px solid transparent;
  border-radius: 30px;
  padding: 0 45px;
  font-size: 15px;
  color: ${colors.neutral};
  transition: all 0.3s ease;
  cursor: pointer;
  appearance: none;

  &:focus {
    background: rgba(45, 55, 72, 0.15);
    border-color: ${colors.secondary};
    outline: none;
    box-shadow: 0 0 0 4px rgba(197, 48, 48, 0.1);
  }
`;

const Textarea = styled.textarea`
  grid-column: 1 / -1;
  padding: 15px 45px;
  border: 2px solid transparent;
  border-radius: 20px;
  font-size: 15px;
  min-height: 120px;
  resize: vertical;
  background: rgba(45, 55, 72, 0.1);
  color: ${colors.neutral};
  transition: all 0.3s ease;

  &:focus {
    background: rgba(45, 55, 72, 0.15);
    border-color: ${colors.secondary};
    outline: none;
    box-shadow: 0 0 0 4px rgba(197, 48, 48, 0.1);
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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  animation: fadeIn 0.5s ease-out;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const PropertyCard = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: ${colors.secondary};
    border-radius: 15px 15px 0 0;
  }
`;

const PropertyImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const PropertyTitle = styled.h3`
  font-size: 22px;
  color: ${colors.primary};
  margin: 0;
  font-weight: 600;
  line-height: 1.3;
`;

const PropertyDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  p {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    margin: 0;
    color: ${colors.neutral};
    
    svg {
      font-size: 18px;
      color: ${colors.secondary};
    }
  }
`;

const PriceTag = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: ${colors.primary};
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    color: ${colors.secondary};
    font-size: 22px;
  }
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  background: ${props => {
    switch(props.status) {
      case 'available': return '#28a745';
      case 'pending': return '#ffc107';
      case 'sold': return '#dc3545';
      default: return '#6c757d';
    }
  }};
`;

const AdvertiseButton = styled.button`
  padding: 8px 16px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s ease;

  &:hover {
    background: #218838;
  }
`;

const FileInputWrapper = styled(InputWrapper)`
  grid-column: 1 / -1;
`;

const FileInput = styled.div`
  position: relative;
  width: 100%;
  height: 50px;
  background: rgba(45, 55, 72, 0.1);
  border: 2px dashed ${colors.secondary};
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;

  input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  &:hover {
    background: rgba(45, 55, 72, 0.15);
    border-color: ${colors.primary};
  }

  .file-label {
    display: flex;
    align-items: center;
    gap: 10px;
    color: ${colors.neutral};
    font-size: 15px;

    svg {
      font-size: 1.2rem;
    }
  }

  &.has-file {
    border-style: solid;
    background: rgba(45, 55, 72, 0.15);

    .file-label {
      color: ${colors.primary};
    }
  }
`;

const PageHeader = styled.div`
  text-align: center;
  margin: 20px 0 40px 0;
  padding: 20px;
  width: 100%;
  max-width: 1000px;
  animation: fadeInDown 0.5s ease-out;
`;

const MainHeading = styled.h1`
  font-size: 42px;
  color: ${colors.white};
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);

  svg {
    font-size: 1.5em;
    color: ${colors.secondary};
    filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2));
  }
`;

const SubHeading = styled.p`
  font-size: 20px;
  color: ${colors.white};
  font-style: italic;
  margin: 0;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  svg {
    font-size: 1.2em;
    color: ${colors.secondary};
    filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.2));
  }

  .quote-left {
    margin-right: 5px;
  }

  .quote-right {
    margin-left: 5px;
  }

  .dream-icon {
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
`;

const PendingButton = styled(AdvertiseButton)`
  background: #ffc107;
  color: #000;
  &:hover {
    background: #e0a800;
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ApprovedButton = styled(AdvertiseButton)`
  background: #28a745;
  &:hover {
    background: #218838;
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled.button`
  padding: 8px 16px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s ease;

  &:hover {
    background: #c82333;
  }
`;

export const logoutSound = () => {
  const audio = new Audio('/sounds/logout.mp3');
  audio.play().catch(e => console.log('Audio play failed:', e));
};

const FormSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  width: 100%;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartWrapper = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const ChartTitle = styled.h3`
  text-align: center;
  margin-bottom: 15px;
  color: ${colors.primary};
`;

const StatisticsSection = ({ properties, advertisementRequests }) => {
  const statusData = {
    labels: ['Available', 'Sold', 'Pending'],
    datasets: [{
      data: [
        properties.filter(p => p.status === 'available').length,
        properties.filter(p => p.status === 'sold').length,
        properties.filter(p => p.status === 'pending').length
      ],
      backgroundColor: ['#28a745', '#dc3545', '#ffc107'],
      borderColor: ['#ffffff', '#ffffff', '#ffffff'],
      borderWidth: 2
    }]
  };

  const advertisementData = {
    labels: ['Advertised', 'Unadvertised'],
    datasets: [{
      data: [
        advertisementRequests.filter(r => r.status === 'approved').length,
        properties.length - advertisementRequests.filter(r => r.status === 'approved').length
      ],
      backgroundColor: ['#007bff', '#6c757d'],
      borderColor: ['#ffffff', '#ffffff'],
      borderWidth: 2
    }]
  };

  const propertyTypes = properties.reduce((acc, prop) => {
    acc[prop.propertyType] = (acc[prop.propertyType] || 0) + 1;
    return acc;
  }, {});

  const propertyTypeData = {
    labels: Object.keys(propertyTypes),
    datasets: [{
      label: 'Number of Properties',
      data: Object.values(propertyTypes),
      backgroundColor: '#4c51bf',
      borderColor: '#434190',
      borderWidth: 1
    }]
  };

  return (
    <StatsContainer>
      <ChartWrapper>
        <ChartTitle>Property Status Distribution</ChartTitle>
        <Pie data={statusData} options={{ responsive: true }} />
      </ChartWrapper>

      <ChartWrapper>
        <ChartTitle>Advertisement Distribution</ChartTitle>
        <Pie data={advertisementData} options={{ responsive: true }} />
      </ChartWrapper>

      <ChartWrapper style={{ gridColumn: '1 / -1' }}>
        <ChartTitle>Property Types Distribution</ChartTitle>
        <Bar 
          data={propertyTypeData} 
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            }
          }} 
        />
      </ChartWrapper>
    </StatsContainer>
  );
};

const SellerPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const [advertisementRequests, setAdvertisementRequests] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    logoutSound();
    localStorage.removeItem('user');
    dispatch(logoutUser());
    navigate('/');
  };

  const handleAdvertise = async (propertyId, price, title, image) => {
    try {
      const token = authService.getToken();
      
      const adRequestResponse = await axios.post('https://realestate-9evw.onrender.com/api/seller/advertise', {
        propertyId,
        amount: 10000,
        currency: 'usd',
        title,
        image,
        product: `Advertisement for: ${title}`
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      localStorage.setItem('advertisementRequestId', adRequestResponse.data.requestId);
      window.location.href = adRequestResponse.data.paymentUrl;
      
      toast.success('Advertisement request sent successfully!');
    } catch (error) {
      console.error('Advertisement request failed:', error);
      toast.error('Failed to initiate advertisement request');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value);
    });
    if (image) {
      submitData.append('image', image);
    }

    try {
      const token = authService.getToken();
      await axios.post('https://realestate-9evw.onrender.com/api/seller/property', submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Property added successfully!');
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
      const response = await axios.get('https://realestate-9evw.onrender.com/api/seller/myProperty', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdvertisementRequests = async () => {
    try {
      const token = authService.getToken();
      const response = await axios.get('https://realestate-9evw.onrender.com/api/seller/advertisement-status', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdvertisementRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch advertisement requests:', error);
      toast.error('Failed to load advertisement status');
    }
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        const token = authService.getToken();
        await axios.post('https://realestate-9evw.onrender.com/api/seller/delete-property', 
          { propertyId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        toast.success('Property deleted successfully');
        setMyProperties(prevProperties => prevProperties.filter(p => p._id !== propertyId));
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Failed to delete property');
        }
      }
    }
  };

  useEffect(() => {
    if (view === 'my-properties') {
      fetchMyProperties();
      fetchAdvertisementRequests();
    }
  }, [view]);

  const getRequestStatus = (propertyId) => {
    const request = advertisementRequests.find(req => req.property === propertyId || req.propertyId === propertyId);
    return request ? request.status : null;
  };

  return (
    <AppContainer>
      <LogoutButton onClick={handleLogout}>
        Logout
      </LogoutButton>
      <PageHeader>
        <MainHeading>
          <FaBuilding />
          Estate Craft
          <FaMagic />
        </MainHeading>
        <SubHeading>
          <FaQuoteLeft className="quote-left" />
          Crafting your dreams into reality
          <GiDreamCatcher className="dream-icon" />
          one property at a time
          <FaQuoteRight className="quote-right" />
        </SubHeading>
      </PageHeader>
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
              <InputWrapper>
                <InputIcon><FaHome /></InputIcon>
                <Input
                  type="text"
                  name="title"
                  placeholder="Property Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </InputWrapper>
              <InputWrapper>
                <InputIcon><FaMapMarkerAlt /></InputIcon>
                <Input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </InputWrapper>
              <InputWrapper>
                <InputIcon><FaHome /></InputIcon>
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
              </InputWrapper>
              <InputWrapper>
                <InputIcon><BiDollar /></InputIcon>
                <Input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </InputWrapper>
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
              <FileInputWrapper>
                <FileInput className={image ? 'has-file' : ''}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    required
                  />
                  <span className="file-label">
                    <MdAddAPhoto />
                    {image ? image.name : 'Upload Property Image'}
                  </span>
                </FileInput>
              </FileInputWrapper>
              <SubmitButton type="submit">Add Property</SubmitButton>
            </PropertyForm>
          </FormSection>
        ) : (
          loading ? (
            <LoadingMessage>Loading...</LoadingMessage>
          ) : (
            <>
              <StatisticsSection 
                properties={myProperties} 
                advertisementRequests={advertisementRequests} 
              />
              <PropertiesGrid>
                {myProperties.map(property => {
                  const adStatus = getRequestStatus(property._id);

                  return (
                    <PropertyCard key={property._id}>
                      <StatusBadge status={property.status || 'available'}>
                        {property.status || 'Available'}
                      </StatusBadge>
                      {property.image && (
                        <PropertyImage 
                          src={`data:image/jpeg;base64,${property.image}`}
                          alt={property.title}
                        />
                      )}
                      <PropertyTitle>{property.title}</PropertyTitle>
                      <PriceTag>
                        <BiDollar />
                        ₹{property.price.toLocaleString()}
                      </PriceTag>
                      <PropertyDetails>
                        <p>
                          <FaMapMarkerAlt />
                          {property.location}
                        </p>
                        {property.bedrooms && (
                          <p>
                            <FaBed />
                            {property.bedrooms} Bedrooms
                          </p>
                        )}
                        {property.bathrooms && (
                          <p>
                            <FaBath />
                            {property.bathrooms} Bathrooms
                          </p>
                        )}
                        {property.area && (
                          <p>
                            <FaRulerCombined />
                            {property.area} sq ft
                          </p>
                        )}
                      </PropertyDetails>

                      {/* Only show Advertise button if NO request or last request was rejected */}
                      {property.status === 'available' && (!adStatus || adStatus === 'rejected') && (
                        <AdvertiseButton 
                          onClick={() => handleAdvertise(
                            property._id,
                            property.price,
                            property.title,
                            property.image
                          )}
                        >
                          <FaBullhorn /> {adStatus === 'rejected' ? <><FaRedo /> Try Again</> : <>Advertise Property</>}
                        </AdvertiseButton>
                      )}

                      {/* Pending and Approved states */}
                      {adStatus === 'pending' && (
                        <PendingButton disabled>
                          <FaClock /> Advertisement Pending
                        </PendingButton>
                      )}
                      {adStatus === 'approved' && (
                        <ApprovedButton disabled>
                          <FaCheckCircle /> Advertisement Active
                        </ApprovedButton>
                      )}

                      {property.status !== 'sold' && property.status !== 'pending' && (
                        <DeleteButton onClick={() => handleDelete(property._id)}>
                          <FaTrash /> Delete
                        </DeleteButton>
                      )}
                    </PropertyCard>
                  );
                })}
              </PropertiesGrid>
            </>
          )
        )}
      </SellerContainer>
      {message && <Message>{message}</Message>}
    </AppContainer>
  );
};

export default SellerPage;

const keyframes = `
  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const style = document.createElement('style');
style.textContent = keyframes;
document.head.appendChild(style);