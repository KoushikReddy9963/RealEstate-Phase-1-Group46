import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { colors } from '../styles/AuthStyles';
import { FaSignOutAlt, FaUpload, FaChartLine, FaList, FaTrash, FaEdit } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const EmployeePage = () => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [advertisements, setAdvertisements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('upload');
    const [editingId, setEditingId] = useState(null);
    const [advertisementRequests, setAdvertisementRequests] = useState([]);
    const [stats, setStats] = useState({
        totalAdvertisements: 0,
        totalRevenue: 0,
        totalPropertyRevenue: 0,
        totalAdvertisementRevenue: 0,
        activeCampaigns: 0
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = useCallback(() => {
        // Clear all localStorage
        localStorage.clear();
        
        // Clear cache and reload
        if ('caches' in window) {
            caches.keys().then((names) => {
                names.forEach(name => {
                    caches.delete(name);
                });
            });
        }

        // Reset all state
        setTitle('');
        setImage(null);
        setPreview(null);
        setAdvertisements([]);
        setLoading(false);
        setActiveTab('upload');
        setEditingId(null);
        setAdvertisementRequests([]);
        setStats({
            totalAdvertisements: 0,
            totalRevenue: 0,
            totalPropertyRevenue: 0,
            totalAdvertisementRevenue: 0
        });

        // Dispatch logout action and navigate
        dispatch(logoutUser());
        navigate('/login');
    }, [dispatch, navigate]);

    const fetchAdvertisements = useCallback(async () => {
        try {
            const userData = localStorage.getItem('user');
            if (!userData) {
                console.error('No user data found');
                handleLogout();
                return;
            }

            const user = JSON.parse(userData);
            const response = await axios.get('https://realestate-9evw.onrender.com/api/employee/advertisements', {
                headers: { 
                    'Authorization': `Bearer ${user.token}`
                }
            });

            console.log('Fetched advertisements:', response.data);
            setAdvertisements(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Failed to fetch advertisements');
            if (error.response?.status === 401) {
                handleLogout();
            }
        }
    }, [handleLogout]);

    const fetchStats = useCallback(async () => {
        try {
            const userData = localStorage.getItem('user');
            if (!userData) {
                console.error('No user data found');
                handleLogout();
                return;
            }

            const user = JSON.parse(userData);
            const response = await axios.get('https://realestate-9evw.onrender.com/api/employee/revenue-stats', {
                headers: { 
                    'Authorization': `Bearer ${user.token}`
                }
            });

            setStats({
                totalAdvertisements: advertisements.length,
                totalRevenue: response.data.data.totalRevenue,
                totalPropertyRevenue: response.data.data.totalPropertyRevenue,
                totalAdvertisementRevenue: response.data.data.totalAdvertisementRevenue
            });
        } catch (error) {
            console.error('Failed to fetch stats:', error);
            toast.error('Failed to fetch stats');
        }
    }, [advertisements, handleLogout]);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            handleLogout();
            return;
        }

        fetchAdvertisements();
        fetchStats();

        const interval = setInterval(() => {
            fetchAdvertisements();
        }, 2 * 60 * 1000);

        return () => clearInterval(interval);
    }, [fetchAdvertisements, fetchStats, handleLogout]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            if (image) {
                formData.append('image', image);
            }

            const userData = localStorage.getItem('user');
            const user = JSON.parse(userData);
            
            if (!user || !user.token) {
                throw new Error('No token found');
            }

            if (editingId) {
                await axios.put(`https://realestate-9evw.onrender.com/api/employee/advertisement/${editingId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                toast.success('Advertisement updated successfully!');
            } else {
                await axios.post('https://realestate-9evw.onrender.com/api/employee/advertisement', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                toast.success('Advertisement created successfully!');
            }

            setTitle('');
            setImage(null);
            setPreview(null);
            setEditingId(null);
            fetchAdvertisements();
            setActiveTab('list');
        } catch (error) {
            console.error('Submit error:', error);
            toast.error(error.response?.data?.message || 'Failed to process advertisement');
            if (error.response?.status === 401) {
                handleLogout();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (id) => {
        try {
            const adToEdit = advertisements.find(ad => ad._id === id);
            if (adToEdit) {
                setTitle(adToEdit.title);
                setPreview(`data:image/jpeg;base64,${adToEdit.content}`);
                setImage(null); 
                setEditingId(id);
                setActiveTab('upload');
            }
        } catch (error) {
            console.error('Edit error:', error);
            toast.error('Failed to load advertisement for editing');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this advertisement?')) {
            try {
                const userData = localStorage.getItem('user');
                const user = JSON.parse(userData);
                
                await axios.delete(`https://realestate-9evw.onrender.com/api/employee/advertisement/${id}`, {
                    headers: { 
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                
                toast.success('Advertisement deleted successfully');
                fetchAdvertisements();
            } catch (error) {
                console.error('Delete error:', error);
                toast.error('Failed to delete advertisement');
                if (error.response?.status === 401) {
                    handleLogout();
                }
            }
        }
    };

    const fetchAdvertisementRequests = useCallback(async () => {
        try {
            const token = localStorage.getItem('user') 
                ? JSON.parse(localStorage.getItem('user')).token 
                : null;

            const response = await axios.get(
                'https://realestate-9evw.onrender.com/api/employee/advertisement-requests',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setAdvertisementRequests(response.data);
        } catch (error) {
            console.error('Failed to fetch requests:', error);
            toast.error('Failed to fetch advertisement requests');
        }
    }, []);

    const handleUpdateRequest = async (requestId, newStatus) => {
        try {
            const token = localStorage.getItem('user') 
                ? JSON.parse(localStorage.getItem('user')).token 
                : null;

            if (!token) {
                toast.error('Authentication required');
                return;
            }

            console.log('Sending update request:', { requestId, status: newStatus });

            const response = await axios.patch(
                'https://realestate-9evw.onrender.com/api/employee/advertisement-request/status',
                {
                    requestId,
                    status: newStatus
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                setAdvertisementRequests(prevRequests =>
                    prevRequests.map(request =>
                        request._id === requestId
                            ? { ...request, status: newStatus }
                            : request
                    )
                );

                toast.success(`Advertisement request ${newStatus} successfully`);
                fetchAdvertisementRequests();
            } else {
                throw new Error(response.data.message);
            }

        } catch (error) {
            console.error('Update request error:', error);
            toast.error(error.response?.data?.message || 'Failed to update advertisement request');
        }
    };

    useEffect(() => {
        fetchAdvertisementRequests();
    }, [fetchAdvertisementRequests, fetchStats, handleLogout]);

    return (
        <PageContainer>
            <Sidebar>
                <SidebarTitle>Employee Dashboard</SidebarTitle>
                <NavButton 
                    active={activeTab === 'upload'} 
                    onClick={() => setActiveTab('upload')}
                >
                    <FaUpload /> Upload Advertisement
                </NavButton>
                <NavButton 
                    active={activeTab === 'list'} 
                    onClick={() => setActiveTab('list')}
                >
                    <FaList /> View Advertisements
                </NavButton>
                <NavButton 
                    active={activeTab === 'stats'} 
                    onClick={() => setActiveTab('stats')}
                >
                    <FaChartLine /> Statistics
                </NavButton>
                <LogoutButton onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                </LogoutButton>
            </Sidebar>

            <MainContent>
                <ToastContainer />
                
                {activeTab === 'upload' && (
                    <ContentSection>
                        <PageTitle>Upload New Advertisement</PageTitle>
                        <StyledForm onSubmit={handleSubmit}>
                            <FormGroup>
                                <StyledLabel>Advertisement Title</StyledLabel>
                                <StyledInput
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    placeholder="Enter advertisement title"
                                />
                            </FormGroup>

                            <FormGroup>
                                <StyledLabel>Upload Image</StyledLabel>
                                <StyledFileInput
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    required={!editingId}
                                />
                            </FormGroup>

                            {preview && (
                                <PreviewContainer>
                                    <PreviewImage src={preview} alt="Preview" />
                                </PreviewContainer>
                            )}

                            <SubmitButton type="submit" disabled={loading}>
                                {loading ? 'Processing...' : (editingId ? 'Update Advertisement' : 'Submit Advertisement')}
                            </SubmitButton>
                        </StyledForm>
                    </ContentSection>
                )}

                {activeTab === 'list' && (
                    <ContentSection>
                        <PageTitle>Advertisement List</PageTitle>
                        <Grid>
                            {advertisements.length > 0 ? (
                                advertisements.map((ad) => (
                                    <Card key={ad._id}>
                                        <CardImage 
                                            src={ad.content?.startsWith('/9j') 
                                                ? `data:image/jpeg;base64,${ad.content}`
                                                : ad.content 
                                                    ? `https://realestate-9evw.onrender.com/uploads/${ad.content}`
                                                    : 'https://via.placeholder.com/400x300?text=Advertisement+Image'
                                            } 
                                            alt={ad.title} 
                                            onError={(e) => {
                                                console.error("Image load error for:", ad.content);
                                                e.target.src = 'https://via.placeholder.com/400x300?text=Advertisement+Image';
                                            }}
                                        />
                                        <CardContent>
                                            <CardTitle>{ad.title}</CardTitle>
                                            <CardDate>
                                                Posted: {new Date(ad.createdAt).toLocaleDateString()}
                                            </CardDate>
                                            <CardActions>
                                                <ActionButton onClick={() => handleEdit(ad._id)}>
                                                    <FaEdit /> Edit
                                                </ActionButton>
                                                <ActionButton 
                                                    onClick={() => handleDelete(ad._id)}
                                                    style={{ background: colors.error }}
                                                >
                                                    <FaTrash /> Delete
                                                </ActionButton>
                                            </CardActions>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <NoDataMessage>No advertisements found</NoDataMessage>
                            )}
                        </Grid>
                    </ContentSection>
                )}

                {activeTab === 'stats' && (
                    <ContentSection>
                        <PageTitle>Statistics & Analytics</PageTitle>
                        
                        <StatsGrid>
                            <StatCard>
                                <StatTitle>Total Advertisements</StatTitle>
                                <StatValue>{stats.totalAdvertisements}</StatValue>
                            </StatCard>
                            <StatCard>
                                <StatTitle>Total Revenue</StatTitle>
                                <StatValue>₹{stats.totalRevenue.toFixed(2)}</StatValue>
                            </StatCard>
                            <StatCard>
                                <StatTitle>Property Revenue</StatTitle>
                                <StatValue>₹{stats.totalPropertyRevenue.toFixed(2)}</StatValue>
                            </StatCard>
                            <StatCard>
                                <StatTitle>Advertisement Revenue</StatTitle>
                                <StatValue>₹{stats.totalAdvertisementRevenue.toFixed(2)}</StatValue>
                            </StatCard>
                        </StatsGrid>

                        <ChartSection>
                            <ChartContainer>
                                <ChartTitle>Revenue Breakdown</ChartTitle>
                                <PieChart width={400} height={300}>
                                    <Pie
                                        data={[
                                            { name: 'Property Revenue', value: stats.totalPropertyRevenue },
                                            { name: 'Advertisement Revenue', value: stats.totalAdvertisementRevenue }
                                        ]}
                                        cx={200}
                                        cy={150}
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label
                                    >
                                        <Cell fill="#0088FE" />
                                        <Cell fill="#00C49F" />
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ChartContainer>
                        </ChartSection>
                    </ContentSection>
                )}
            </MainContent>

            <RequestsSection>
                <h2>Advertisement Requests</h2>
                {loading ? (
                    <LoadingMessage>Loading requests...</LoadingMessage>
                ) : advertisementRequests.length === 0 ? (
                    <NoDataMessage>No advertisement requests found</NoDataMessage>
                ) : (
                    <RequestsGrid>
                        {advertisementRequests.map(request => {
                            const hasProperty = request.property && request.property.image && request.property.title;
                            return (
                                <RequestCard key={request._id}>
                                    {hasProperty ? (
                                        <RequestImage 
                                            src={`data:image/jpeg;base64,${request.property.image}`} 
                                            alt={request.property.title}
                                        />
                                    ) : (
                                        <RequestImage 
                                            src="https://via.placeholder.com/400x300?text=No+Image" 
                                            alt="No property"
                                        />
                                    )}
                                    <RequestInfo>
                                        <h3>{hasProperty ? request.property.title : "No property"}</h3>
                                        <p>Seller: {request.seller?.email || "Unknown"}</p>
                                        <StatusBadge status={request.status}>
                                            {request.status?.toUpperCase() || "UNKNOWN"}
                                        </StatusBadge>
                                    </RequestInfo>
                                    {request.status === 'pending' && (
                                        <RequestActions>
                                            <RequestActionButton 
                                                className="approve"
                                                onClick={() => handleUpdateRequest(request._id, 'approved')}
                                                disabled={loading}
                                            >
                                                Approve
                                            </RequestActionButton>
                                            <RequestActionButton 
                                                className="reject"
                                                onClick={() => handleUpdateRequest(request._id, 'rejected')}
                                                disabled={loading}
                                            >
                                                Reject
                                            </RequestActionButton>
                                        </RequestActions>
                                    )}
                                </RequestCard>
                            );
                        })}
                    </RequestsGrid>
                )}
            </RequestsSection>
        </PageContainer>
    );
};

const PageContainer = styled.div`
    display: flex;
    min-height: 100vh;
    background: ${colors.background};
`;

const Sidebar = styled.div`
    width: 250px;
    background: ${colors.primary};
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const SidebarTitle = styled.h1`
    color: ${colors.white};
    font-size: 1.5rem;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid ${colors.white};
`;

const NavButton = styled.button`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    background: ${props => props.active ? colors.accent : 'transparent'};
    color: ${colors.white};
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: ${colors.accent};
    }
`;

const LogoutButton = styled(NavButton)`
    margin-top: auto;
    background: ${colors.error};
    &:hover {
        background: ${colors.secondary};
    }
`;

const MainContent = styled.div`
    flex: 1;
    padding: 20px;
    overflow-y: auto;
`;

const ContentSection = styled.div`
    background: ${colors.white};
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const PageTitle = styled.h1`
    font-size: 2.5rem;
    color: ${colors.primary};
    margin-bottom: 30px;
    text-align: center;
    font-weight: 600;
`;

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 25px;
    max-width: 600px;
    margin: 0 auto;
    padding: 30px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const StyledLabel = styled.label`
    font-size: 1.2rem;
    color: ${colors.primary};
    font-weight: 500;
`;

const StyledInput = styled.input`
    padding: 15px;
    border: 2px solid ${colors.neutral}40;
    border-radius: 10px;
    font-size: 1.1rem;
    transition: all 0.3s ease;

    &:focus {
        border-color: ${colors.accent};
        box-shadow: 0 0 0 4px ${colors.accent}20;
        outline: none;
    }
`;

const StyledFileInput = styled.input`
    padding: 12px;
    border: 2px dashed ${colors.neutral}40;
    border-radius: 10px;
    background: ${colors.background};
    cursor: pointer;
    font-size: 1.1rem;

    &:hover {
        border-color: ${colors.accent};
    }
`;

const PreviewContainer = styled.div`
    display: flex;
    justify-content: center;
    margin: 20px 0;
`;

const PreviewImage = styled.img`
    max-width: 100%;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const SubmitButton = styled.button`
    padding: 12px;
    background: ${colors.accent};
    color: ${colors.white};
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: ${colors.gold};
    }

    &:disabled {
        background: ${colors.neutral};
        cursor: not-allowed;
    }
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
`;

const Card = styled.div`
    background: white;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-5px);
    }
`;

const CardImage = styled.img`
    width: 100%;
    height: 250px;
    object-fit: cover;
`;

const CardContent = styled.div`
    padding: 20px;
`;

const CardTitle = styled.h3`
    font-size: 1.5rem;
    color: ${colors.primary};
    margin-bottom: 10px;
`;

const CardDate = styled.p`
    font-size: 1rem;
    color: ${colors.neutral};
    margin-bottom: 15px;
`;

const CardActions = styled.div`
    display: flex;
    gap: 15px;
    justify-content: flex-end;
`;

const ActionButton = styled.button`
    padding: 10px 20px;
    background: ${colors.accent};
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:hover {
        background: ${colors.gold};
        transform: translateY(-2px);
    }

    svg {
        font-size: 1.2rem;
    }
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
`;

const StatCard = styled.div`
    background: ${colors.white};
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
`;

const StatTitle = styled.h3`
    color: ${colors.neutral};
    margin-bottom: 10px;
`;

const StatValue = styled.div`
    color: ${colors.primary};
    font-size: 2rem;
    font-weight: bold;
`;

const NoDataMessage = styled.p`
    text-align: center;
    color: ${colors.neutral};
    font-size: 1.2rem;
    grid-column: 1 / -1;
    padding: 20px;
`;

const ChartSection = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin: 30px 0;
    justify-content: center;
`;

const ChartContainer = styled.div`
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h3`
    color: ${colors.primary};
    margin-bottom: 20px;
    text-align: center;
    font-size: 1.2rem;
`;

const RequestsSection = styled.div`
    margin-top: 30px;
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const RequestsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
`;

const RequestCard = styled.div`
    border: 1px solid ${colors.neutral}20;
    border-radius: 8px;
    overflow: hidden;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const RequestImage = styled.img`
    width: 100%;
    height: 200px;
    object-fit: cover;
`;

const RequestInfo = styled.div`
    padding: 15px;
    h3 {
        margin: 0 0 10px;
        color: ${colors.primary};
    }
    p {
        margin: 5px 0;
        color: ${colors.neutral};
    }
`;

const StatusBadge = styled.span`
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 500;
    background: ${props => {
        switch(props.status) {
            case 'approved': return '#e1f7e1';
            case 'rejected': return '#ffe1e1';
            default: return '#fff3e1';
        }
    }};
    color: ${props => {
        switch(props.status) {
            case 'approved': return '#2e7d32';
            case 'rejected': return '#d32f2f';
            default: return '#ed6c02';
        }
    }};
`;

const RequestActions = styled.div`
    display: flex;
    gap: 10px;
    padding: 15px;
`;

const RequestActionButton = styled.button`
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &.approve {
        background: #28a745;
        color: white;
        &:hover { background: #218838; }
    }
    
    &.reject {
        background: #dc3545;
        color: white;
        &:hover { background: #c82333; }
    }
`;

const LoadingMessage = styled.div`
    text-align: center;
    padding: 20px;
    color: ${colors.neutral};
`;


export default EmployeePage;