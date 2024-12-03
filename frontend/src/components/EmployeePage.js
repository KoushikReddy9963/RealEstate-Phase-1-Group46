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
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell 
} from 'recharts';

const EmployeePage = () => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [advertisements, setAdvertisements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('upload');
    const [editingId, setEditingId] = useState(null);
    const [mockData] = useState({
        monthlyAds: [
            { month: 'Jan', count: 4 },
            { month: 'Feb', count: 6 },
            { month: 'Mar', count: 8 },
            { month: 'Apr', count: 5 },
            { month: 'May', count: 9 },
            { month: 'Jun', count: 7 },
        ],
        adPerformance: [
            { name: 'Views', value: 400 },
            { name: 'Clicks', value: 300 },
            { name: 'Conversions', value: 100 },
        ],
        transactions: [
            { id: 'tx_1234', date: '2024-03-15', amount: 99.99, status: 'completed' },
            { id: 'tx_5678', date: '2024-03-14', amount: 149.99, status: 'completed' },
            { id: 'tx_9012', date: '2024-03-13', amount: 199.99, status: 'pending' },
        ]
    });
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = useCallback(() => {
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
            const response = await axios.get('http://localhost:5000/api/employee/advertisements', {
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

    useEffect(() => {
        fetchAdvertisements();
    }, [fetchAdvertisements]);

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
                // Update existing advertisement
                await axios.put(`http://localhost:5000/api/employee/advertisement/${editingId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                toast.success('Advertisement updated successfully!');
            } else {
                // Create new advertisement
                await axios.post('http://localhost:5000/api/employee/advertisement', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                toast.success('Advertisement created successfully!');
            }

            // Reset form
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
                setImage(null); // Reset image since we don't need to upload unless changed
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
                
                await axios.delete(`http://localhost:5000/api/employee/advertisement/${id}`, {
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
                                            src={`data:image/jpeg;base64,${ad.content}`} 
                                            alt={ad.title} 
                                            onError={(e) => {
                                                console.error('Image load error');
                                                e.target.src = 'fallback-image-url.jpg';
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
                                <StatValue>{advertisements.length}</StatValue>
                            </StatCard>
                            <StatCard>
                                <StatTitle>Total Revenue</StatTitle>
                                <StatValue>$1,249.99</StatValue>
                            </StatCard>
                            <StatCard>
                                <StatTitle>Active Campaigns</StatTitle>
                                <StatValue>12</StatValue>
                            </StatCard>
                        </StatsGrid>

                        <ChartSection>
                            <ChartContainer>
                                <ChartTitle>Monthly Advertisements</ChartTitle>
                                <BarChart width={500} height={300} data={mockData.monthlyAds}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill={colors.accent} />
                                </BarChart>
                            </ChartContainer>

                            <ChartContainer>
                                <ChartTitle>Advertisement Performance</ChartTitle>
                                <PieChart width={400} height={300}>
                                    <Pie
                                        data={mockData.adPerformance}
                                        cx={200}
                                        cy={150}
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label
                                    >
                                        {mockData.adPerformance.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ChartContainer>
                        </ChartSection>

                        <TransactionSection>
                            <ChartTitle>Recent Transactions</ChartTitle>
                            <TransactionTable>
                                <thead>
                                    <tr>
                                        <th>Transaction ID</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockData.transactions.map((tx) => (
                                        <tr key={tx.id}>
                                            <td>{tx.id}</td>
                                            <td>{new Date(tx.date).toLocaleDateString()}</td>
                                            <td>${tx.amount}</td>
                                            <td>
                                                <StatusBadge status={tx.status}>
                                                    {tx.status}
                                                </StatusBadge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </TransactionTable>
                        </TransactionSection>
                    </ContentSection>
                )}
            </MainContent>
        </PageContainer>
    );
};

// Enhanced Styled Components
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

const TransactionSection = styled.div`
    margin-top: 30px;
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const TransactionTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;

    th, td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid ${colors.neutral}20;
    }

    th {
        background-color: ${colors.background};
        color: ${colors.primary};
        font-weight: 600;
    }

    tr:hover {
        background-color: ${colors.background};
    }
`;

const StatusBadge = styled.span`
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.9rem;
    text-transform: capitalize;
    background: ${props => props.status === 'completed' ? '#e1f7e1' : '#fff3e1'};
    color: ${props => props.status === 'completed' ? '#2e7d32' : '#ed6c02'};
`;

export default EmployeePage;