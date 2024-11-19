import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import authService from '../services/AuthService';
import { Card, SubTitle } from '../styles/commonStyles';
import { colors } from '../styles/commonStyles';

const Input = styled.input`
  padding: 12px;
  border: 1.5px solid #999;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  transition: all 0.3s ease;

  &:focus {
    border-color: ${colors.accent};
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    outline: none;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1.5px solid #999;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  transition: all 0.3s ease;
  background-color: white;

  &:focus {
    border-color: ${colors.accent};
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    outline: none;
  }
`;

const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    userDateFrom: '',
    userDateTo: '',
    propertyDateFrom: '',
    propertyDateTo: '',
    propertyStatus: '',
    userRole: '',
    feedbackDateFrom: '',
    feedbackDateTo: ''
  });
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const token = authService.getToken();
      const response = await axios.get('http://localhost:5000/api/admin/dashboard-stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const applyFilters = useCallback(async () => {
    setLoading(true);
    try {
      const token = authService.getToken();
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await axios.get(
        `http://localhost:5000/api/admin/dashboard-stats?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setStats(response.data);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const FilterSection = styled.div`
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    margin-bottom: 2rem;
  `;

  const FilterGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  `;

  const renderUserFilters = () => (
    <FilterSection>
      <h3>Filter Users</h3>
      <FilterGrid>
        <Input
          type="date"
          name="userDateFrom"
          value={filters.userDateFrom}
          onChange={handleFilterChange}
          placeholder="From Date"
        />
        <Input
          type="date"
          name="userDateTo"
          value={filters.userDateTo}
          onChange={handleFilterChange}
          placeholder="To Date"
        />
        <Select
          name="userRole"
          value={filters.userRole}
          onChange={handleFilterChange}
        >
          <option value="">All Roles</option>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
          <option value="employee">Employee</option>
        </Select>
      </FilterGrid>
      <ApplyFilterButton onClick={applyFilters}>Apply Filters</ApplyFilterButton>
    </FilterSection>
  );

  const renderPropertyFilters = () => (
    <FilterSection>
      <h3>Filter Properties</h3>
      <FilterGrid>
        <Input
          type="date"
          name="propertyDateFrom"
          value={filters.propertyDateFrom}
          onChange={handleFilterChange}
          placeholder="From Date"
        />
        <Input
          type="date"
          name="propertyDateTo"
          value={filters.propertyDateTo}
          onChange={handleFilterChange}
          placeholder="To Date"
        />
        <Select
          name="propertyStatus"
          value={filters.propertyStatus}
          onChange={handleFilterChange}
        >
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="pending">Pending</option>
          <option value="sold">Sold</option>
        </Select>
      </FilterGrid>
      <ApplyFilterButton onClick={applyFilters}>Apply Filters</ApplyFilterButton>
    </FilterSection>
  );

  const renderFeedbackFilters = () => (
    <FilterSection>
      <h3>Filter Feedback</h3>
      <FilterGrid>
        <Input
          type="date"
          name="feedbackDateFrom"
          value={filters.feedbackDateFrom}
          onChange={handleFilterChange}
          placeholder="From Date"
        />
        <Input
          type="date"
          name="feedbackDateTo"
          value={filters.feedbackDateTo}
          onChange={handleFilterChange}
          placeholder="To Date"
        />
      </FilterGrid>
      <ApplyFilterButton onClick={applyFilters}>Apply Filters</ApplyFilterButton>
    </FilterSection>
  );

  const renderDashboard = () => (
    <DashboardGrid>
      <StatCard>
        <StatTitle>User Statistics</StatTitle>
        <StatValue>{stats.totalCounts.buyers + stats.totalCounts.sellers + stats.totalCounts.employees}</StatValue>
        <StatDetails>
          <StatDetail>Buyers: {stats.totalCounts.buyers}</StatDetail>
          <StatDetail>Sellers: {stats.totalCounts.sellers}</StatDetail>
          <StatDetail>Employees: {stats.totalCounts.employees}</StatDetail>
        </StatDetails>
      </StatCard>

      <StatCard>
        <StatTitle>Employee Overview</StatTitle>
        <StatValue>{stats.employeeStats.total}</StatValue>
        <StatDetails>
          <StatDetail>Active: {stats.employeeStats.active}</StatDetail>
          <StatDetail>Inactive: {stats.employeeStats.inactive}</StatDetail>
        </StatDetails>
      </StatCard>

      <StatCard>
        <StatTitle>Property Overview</StatTitle>
        <StatValue>{stats.totalCounts.properties}</StatValue>
        <StatDetails>
          <StatDetail>Available: {stats.propertyStatus.available}</StatDetail>
          <StatDetail>Pending: {stats.propertyStatus.pending}</StatDetail>
          <StatDetail>Sold: {stats.propertyStatus.sold}</StatDetail>
        </StatDetails>
      </StatCard>

      <RecentActivityCard>
        <StatTitle>Recent Properties</StatTitle>
        {stats.recentProperties.map(property => (
          <ActivityItem key={property._id}>
            <PropertyTitle>{property.title}</PropertyTitle>
            <PropertyDetails>
              <span>₹{property.price.toLocaleString()}</span>
              <StatusBadge status={property.status}>{property.status}</StatusBadge>
            </PropertyDetails>
          </ActivityItem>
        ))}
      </RecentActivityCard>
    </DashboardGrid>
  );

  const renderUsers = () => (
    <TableContainer>
      <Table>
        <TableHeader>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined Date</th>
          </tr>
        </TableHeader>
        <TableBody>
          {stats?.users?.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderProperties = () => (
    <TableContainer>
      <Table>
        <TableHeader>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Status</th>
            <th>Listed Date</th>
          </tr>
        </TableHeader>
        <TableBody>
          {stats?.properties?.map(property => (
            <tr key={property._id}>
              <td>{property.title}</td>
              <td>₹{property.price.toLocaleString()}</td>
              <td><StatusBadge status={property.status}>{property.status}</StatusBadge></td>
              <td>{new Date(property.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderFeedback = () => (
    <FeedbackContainer>
      {stats?.feedbacks?.map(feedback => (
        <FeedbackCard key={feedback._id}>
          <FeedbackContent>{feedback.message}</FeedbackContent>
          <FeedbackDetails>
            <span>By: {feedback.user?.name || 'Anonymous'}</span>
            <span>Rating: {feedback.rating}/5</span>
            <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
          </FeedbackDetails>
        </FeedbackCard>
      ))}
    </FeedbackContainer>
  );

  if (loading) return <LoadingWrapper>Loading...</LoadingWrapper>;
  if (error) return <ErrorDisplay error={error} onRetry={fetchDashboardData} />;

  return (
    <PageContainer>
      <Header>
        <Title>Admin Dashboard</Title>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Header>

      <TabContainer>
        <Tab active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')}>
          Dashboard
        </Tab>
        <Tab active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
          Users
        </Tab>
        <Tab active={activeTab === 'properties'} onClick={() => setActiveTab('properties')}>
          Properties
        </Tab>
        <Tab active={activeTab === 'feedback'} onClick={() => setActiveTab('feedback')}>
          Feedback
        </Tab>
      </TabContainer>

      {activeTab === 'dashboard' && (
        <DashboardGrid>
          {renderDashboard()}
        </DashboardGrid>
      )}

      {activeTab === 'users' && (
        <>
          {renderUserFilters()}
          {renderUsers()}
        </>
      )}

      {activeTab === 'properties' && (
        <>
          {renderPropertyFilters()}
          {renderProperties()}
        </>
      )}

      {activeTab === 'feedback' && (
        <>
          {renderFeedbackFilters()}
          {renderFeedback()}
        </>
      )}
    </PageContainer>
  );
};

// Updated styled components with better visibility
const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 32px;
  color: #1a1a1a;
  margin: 0;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const StatCard = styled(Card)`
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const StatTitle = styled(SubTitle)`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const StatValue = styled.div`
  font-size: 3.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 1rem 0;
`;

const StatDetail = styled.div`
  font-size: 1.4rem;
  color: #34495e;
  padding: 0.8rem 0;
  border-bottom: 1px solid ${colors.border};
  font-weight: 500;
`;

const PropertyTitle = styled.h4`
  font-size: 20px;
  color: #333;
  margin: 0;
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 16px;
  background-color: ${props => 
    props.status === 'available' ? '#28a745' :
    props.status === 'pending' ? '#ffc107' :
    '#dc3545'};
  color: white;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  color: #666;
`;

const ErrorDisplay = ({ error, onRetry }) => {
  return (
    <LoadingWrapper>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#dc3545', marginBottom: '1rem' }}>{error}</p>
        <button 
          onClick={onRetry}
          style={{
            padding: '8px 16px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    </LoadingWrapper>
  );
};

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
`;

const Tab = styled.button`
  padding: 1rem 2rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#007bff' : 'transparent'};
  color: ${props => props.active ? '#007bff' : '#666'};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: ${props => props.active ? '600' : '400'};
  font-size: 16px;

  &:hover {
    color: #007bff;
  }
`;

const RecentActivityCard = styled(StatCard)`
  grid-column: span 2;
`;

const ActivityItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const PropertyDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FeedbackContent = styled.p`
  font-size: 16px;
  color: #333;
  margin: 0;
`;

const FeedbackDetails = styled.div`
  font-size: 14px;
  color: #666;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const LogoutButton = styled.button`
  padding: 8px 16px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #c82333;
  }
`;

const StatDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const TableContainer = styled.div`
  margin-top: 2rem;
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: #f8f9fa;
  th {
    padding: 1.2rem;
    text-align: left;
    font-weight: 600;
    color: #495057;
    font-size: 18px;
  }
`;

const TableBody = styled.tbody`
  td {
    padding: 1.2rem;
    border-bottom: 1px solid #dee2e6;
    font-size: 16px;
  }
`;

const FeedbackContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const FeedbackCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ApplyFilterButton = styled.button`
  padding: 12px 24px;
  background: ${colors.accent};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-top: 1rem;

  &:hover {
    background: ${colors.accentDark};
  }
`;

// Export the component
export default AdminPage;