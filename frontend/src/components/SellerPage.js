import React, { useState } from 'react';
import axios from 'axios';
import authService from '../services/AuthService';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: relative;
  overflow: hidden; 
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(https://images.unsplash.com/photo-1494526585095-c41746248156?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D);
  background-size: cover;
  background-position: center;
  filter: blur(3px) brightness(0.6);
  z-index: 0; 
`;

const SellerContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(220, 220, 255, 0.9));
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  z-index: 1; /* Bring the form to the front */
  backdrop-filter: blur(15px);
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.02); /* Slightly enlarge on hover */
  }
`;

const SellerHeading = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  font-size: 28px;
  color: #4a4a4a;
  text-shadow: 1px 1px 3px rgba(255, 255, 255, 0.8);
`;

const PropertyForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #007bff;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s, box-shadow 0.3s;
  background-color: rgba(255, 255, 255, 0.8);

  &:focus {
    border-color: #0056b3;
    box-shadow: 0 0 5px rgba(0, 86, 179, 0.5);
    outline: none;
  }
`;

const Textarea = styled.textarea`
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #007bff;
  border-radius: 8px;
  font-size: 16px;
  resize: vertical;
  transition: border-color 0.3s, box-shadow 0.3s;
  background-color: rgba(255, 255, 255, 0.8);

  &:focus {
    border-color: #0056b3;
    box-shadow: 0 0 5px rgba(0, 86, 179, 0.5);
    outline: none;
  }
`;

const SubmitButton = styled.button`
  padding: 12px;
  background: linear-gradient(90deg, #007bff, #0056b3);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s, transform 0.2s;

  &:hover {
    background: linear-gradient(90deg, #0056b3, #007bff);
    transform: translateY(-2px); 
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


const SellerPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const makepayment = async () => {

    const token = authService.getToken();
    const data = {
      amount: price * 100,
      currency: 'usd',
      product: title,
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
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('location', location);
    formData.append('image', image);


    console.log('Form data:', formData);

    try {
      const token = authService.getToken();
      await axios.post('http://localhost:5000/api/seller/property', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Property added successfully!');
      setTitle('');
      setDescription('');
      setPrice('');
      setLocation('');
      setImage(null);
    } catch (error) {
      setMessage('Failed to add property.');
    }
  };

  return (
    <AppContainer>
      <BackgroundImage />
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
      <SellerContainer>
        <SellerHeading>Add New Property</SellerHeading>
        {message && <Message>{message}</Message>}
        <PropertyForm onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <Input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleImageChange}
            required
          />
          <SubmitButton type="submit">Add Property</SubmitButton>
        </PropertyForm>
        <PaymentButton onClick={makepayment}>Make Payment</PaymentButton>
      </SellerContainer>
    </AppContainer>
  );
};

export default SellerPage;
