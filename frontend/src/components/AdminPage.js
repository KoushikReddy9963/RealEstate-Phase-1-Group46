import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    --primary-dark-blue: #1e3a8a;
    --light-blue: #bfdbfe;
    --very-light-blue: #eff6ff;
    --white: #ffffff;
    --text-dark: #1e3a8a;
    --text-light: #eff6ff;
    --delete-red: #ef4444;
  }

  body {
    background-color: var(--very-light-blue);
    color: var(--text-dark);
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: var(--primary-dark-blue);
  border-bottom: 2px solid var(--light-blue);
  padding-bottom: 10px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background-color: var(--white);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(37, 99, 235, 0.1);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(37, 99, 235, 0.2);
  }
`;

const CardContent = styled.div`
  padding: 20px;
  flex-grow: 1;

  h3 {
    margin: 0 0 15px;
    font-size: 1.5rem;
    color: var(--text-dark);
  }

  p {
    margin: 10px 0;
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--primary-dark-blue);
  }
`;

const CardFooter = styled.div`
  padding: 15px 20px;
  background-color: var(--light-blue);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
`;

const DateSpan = styled.span`
  color: var(--primary-dark-blue);
`;

const DeleteButton = styled.button`
  padding: 8px 12px;
  background-color: var(--delete-red);
  color: var(--white);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  font-size: 1.4rem;
  font-weight: bold;

  &:hover {
    background-color: #dc2626;
    transform: scale(1.05);
  }
`;

const LogoutButton = styled.button`
  padding: 10px 20px;
  background-color: var(--primary-dark-blue);
  color: var(--white);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  position: absolute;
  top: 20px;
  right: 20px;
  font-weight: bold;

  &:hover {
    background-color: var(--light-blue);
    color: var(--text-dark);
  }

  @media (max-width: 768px) {
    position: static;
    margin-bottom: 20px;
    width: 100%;
  }
`;

const Loading = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: var(--primary-dark-blue);
`;

const ErrorMessage = styled.div`
  color: var(--delete-red);
  text-align: center;
  font-size: 1rem;
`;

const SummarySection = styled.div`
  margin-top: 45px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled(Card)`
  text-align: center;
`;

const SummaryTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--primary-dark-blue);
  margin-bottom: 10px;
`;

const SummaryCount = styled.p`
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-dark-blue);
`;

  const AdminPage = () => {
    const [data, setData] = useState({ users: [], feedbacks: [], properties: [], counts: {} });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchData = async () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userObject = JSON.parse(storedUser);
          const token = userObject.token;
  
          try {
            const response = await axios.get("http://localhost:5000/api/admin", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            console.log("API response:", response.data);
            setData(response.data);
            setLoading(false);
          } catch (error) {
            console.error("Error fetching data:", error);
            setError(error.response?.data?.message || "Failed to fetch data");
            setLoading(false);
          }
        } else {
          setError("No user token found");
          setLoading(false);
        }
      };
      fetchData();
    }, []);
  
const handleDeleteUser = async (id) => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const userObject = JSON.parse(storedUser);
    const token = userObject.token;

    try {
      await axios.delete(`http://localhost:5000/api/admin/delete-user/${id}`, {
        headers: {
        Authorization: `Bearer ${ token }`,
      },
  });

  setData(prevData => ({
    ...prevData,
    users: prevData.users.filter(user => user._id !== id),
  }));
  alert('User deleted successfully');
} catch (error) {
  console.error("Error deleting user:", error);
  alert('Failed to delete user');
}
    }
  };

const handleDeleteFeedback = async (id) => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const userObject = JSON.parse(storedUser);
    const token = userObject.token;

    try {
      await axios.post(
        `http://localhost:5000/api/admin/delete-feedback,
        { id }`,
        {
          headers: {
            Authorization: `Bearer ${ token }`,
            },
  }
        );
setData(prevData => ({
  ...prevData,
  feedbacks: prevData.feedbacks.filter(feedback => feedback._id !== id),
}));
      } catch (error) {
  console.error("Error deleting feedback:", error);
}
    }
  };

const handleLogout = () => {
  localStorage.removeItem('user');
  navigate('/');
};

if (loading) return <Loading>Loading...</Loading>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <>
      <GlobalStyle />
      <Container>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>

        <SummarySection>
          <SummaryCard>
            <CardContent>
              <SummaryTitle>Total Users</SummaryTitle>
              <SummaryCount>{data.counts.users || 0}</SummaryCount>
            </CardContent>
          </SummaryCard>
          <SummaryCard>
            <CardContent>
              <SummaryTitle>Total Feedbacks</SummaryTitle>
              <SummaryCount>{data.counts.feedbacks || 0}</SummaryCount>
            </CardContent>
          </SummaryCard>
          <SummaryCard>
            <CardContent>
              <SummaryTitle>Total Properties</SummaryTitle>
              <SummaryCount>{data.counts.properties || 0}</SummaryCount>
            </CardContent>
          </SummaryCard>
        </SummarySection>

        <Section>
          <SectionTitle>Users</SectionTitle>
          <CardGrid>
            {data.users.map((user) => (
              <Card key={user._id}>
                <CardContent>
                  <h3>{user.name}</h3>
                  <p>Email: {user.email}</p>
                  <p>Role: {user.role}</p>
                </CardContent>
                <CardFooter>
                  <DateSpan>{new Date().toLocaleDateString()}</DateSpan>
                  <DeleteButton onClick={() => handleDeleteUser(user._id)}>
                    Delete
                  </DeleteButton>
                </CardFooter>
              </Card>
            ))}
          </CardGrid>
        </Section>

        <Section>
          <SectionTitle>Feedbacks</SectionTitle>
          <CardGrid>
            {data.feedbacks.map((feedback) => (
              <Card key={feedback._id}>
                <CardContent>
                  <h3>{feedback.name}</h3>
                  <p>Email: {feedback.email}</p>
                  <p>Feedback: {feedback.message}</p>
                </CardContent>
                <CardFooter>
                  <DateSpan>{new Date().toLocaleDateString()}</DateSpan>
                  <DeleteButton onClick={() => handleDeleteFeedback(feedback._id)}>
                    Delete
                  </DeleteButton>
                </CardFooter>
              </Card>
            ))}
          </CardGrid>
        </Section>

        {data.properties && data.properties.length > 0 && (
          <Section>
            <SectionTitle>Properties</SectionTitle>
            <CardGrid>
              {data.properties.map((property) => (
                <Card key={property._id}>
                  <CardContent>
                    <h3>{property.title}</h3>
                    <p>Price: ${property.price}</p>
                    <p>Location: {property.location}</p>
                  </CardContent>
                  <CardFooter>
                    <DateSpan>{new Date(property.createdAt).toLocaleDateString()}</DateSpan>
                  </CardFooter>
                </Card>
              ))}
            </CardGrid>
          </Section>
        )}
      </Container>
    </>
  );
};

export default AdminPage;