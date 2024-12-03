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

const EmployeePage = () => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [advertisements, setAdvertisements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('upload');
    
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
                console.error('No user data found in localStorage');
                handleLogout();
                return;
            }

            const user = JSON.parse(userData);
            if (!user.token) {
                console.error('No token found in user data');
                handleLogout();
                return;
            }

            console.log('Fetching with token:', user.token); // Debug log

            const response = await axios.get('http://localhost:5000/api/adv/Advertisement', {
                headers: { 
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response:', response.data); // Debug log
            setAdvertisements(response.data);
            
        } catch (error) {
            console.error('Fetch error:', error); // Debug log
            if (error.response) {
                console.error('Error response:', error.response.data);
                toast.error(error.response.data.message || 'Failed to fetch advertisements');
            } else if (error.request) {
                console.error('No response received:', error.request);
                toast.error('Network error - please check your connection');
            } else {
                console.error('Error:', error.message);
                toast.error('An error occurred while fetching advertisements');
            }

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
            formData.append('image', image);

            const userData = localStorage.getItem('user');
            const user = JSON.parse(userData);
            
            if (!user || !user.token) {
                throw new Error('No token found');
            }

            await axios.post('http://localhost:5000/api/adv/Advertisement', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            toast.success('Advertisement uploaded successfully!');
            setTitle('');
            setImage(null);
            setPreview(null);
            fetchAdvertisements();
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.message || 'Failed to upload advertisement');
            if (error.response?.status === 401) {
                handleLogout();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this advertisement?')) {
            try {
                const token = JSON.parse(localStorage.getItem('user'))?.token;
                if (!token) {
                    throw new Error('No token found');
                }
                await axios.delete(`http://localhost:5000/api/employee/advertisement/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Advertisement deleted successfully');
                fetchAdvertisements();
            } catch (error) {
                toast.error('Failed to delete advertisement');
                if (error.response && error.response.status === 401) {
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
                        <SectionTitle>Upload New Advertisement</SectionTitle>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label>Advertisement Title</Label>
                                <Input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    placeholder="Enter advertisement title"
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label>Upload Image</Label>
                                <FileInput
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    required
                                />
                            </FormGroup>

                            {preview && (
                                <PreviewImage src={preview} alt="Preview" />
                            )}

                            <SubmitButton type="submit" disabled={loading}>
                                {loading ? 'Uploading...' : 'Submit Advertisement'}
                            </SubmitButton>
                        </Form>
                    </ContentSection>
                )}

                {activeTab === 'list' && (
                    <ContentSection>
                        <SectionTitle>Advertisement List</SectionTitle>
                        <Grid>
                            {advertisements.map((ad) => (
                                <Card key={ad._id}>
                                    <CardImage src={ad.imageUrl} alt={ad.title} />
                                    <CardContent>
                                        <CardTitle>{ad.title}</CardTitle>
                                        <CardDate>
                                            Posted: {new Date(ad.createdAt).toLocaleDateString()}
                                        </CardDate>
                                        <CardActions>
                                            <ActionButton onClick={() => handleDelete(ad._id)}>
                                                <FaTrash /> Delete
                                            </ActionButton>
                                            <ActionButton>
                                                <FaEdit /> Edit
                                            </ActionButton>
                                        </CardActions>
                                    </CardContent>
                                </Card>
                            ))}
                        </Grid>
                    </ContentSection>
                )}

                {activeTab === 'stats' && (
                    <ContentSection>
                        <SectionTitle>Statistics</SectionTitle>
                        <StatsGrid>
                            <StatCard>
                                <StatTitle>Total Advertisements</StatTitle>
                                <StatValue>{advertisements.length}</StatValue>
                            </StatCard>
                            {/* Add more statistics cards as needed */}
                        </StatsGrid>
                    </ContentSection>
                )}
            </MainContent>
        </PageContainer>
    );
};

// Styled Components
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

const SectionTitle = styled.h2`
    color: ${colors.primary};
    margin-bottom: 20px;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

const Label = styled.label`
    color: ${colors.neutral};
    font-weight: 500;
`;

const Input = styled.input`
    padding: 12px;
    border: 1.5px solid ${colors.neutral};
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:focus {
        border-color: ${colors.accent};
        outline: none;
    }
`;

const FileInput = styled.input`
    padding: 12px;
    border: 1.5px solid ${colors.neutral};
    border-radius: 8px;
    background: ${colors.background};
`;

const PreviewImage = styled.img`
    max-width: 300px;
    border-radius: 8px;
    margin-top: 10px;
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
    background: ${colors.white};
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const CardImage = styled.img`
    width: 100%;
    height: 200px;
    object-fit: cover;
`;

const CardContent = styled.div`
    padding: 15px;
`;

const CardTitle = styled.h3`
    color: ${colors.primary};
    margin-bottom: 10px;
`;

const CardDate = styled.p`
    color: ${colors.neutral};
    font-size: 0.9rem;
    margin-bottom: 10px;
`;

const CardActions = styled.div`
    display: flex;
    gap: 10px;
`;

const ActionButton = styled.button`
    padding: 8px 12px;
    background: ${colors.accent};
    color: ${colors.white};
    border: none;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.3s ease;

    &:hover {
        background: ${colors.gold};
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

export default EmployeePage;