import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectToken } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';

const PurchasedPropertiesPage = () => {
    const [purchasedProperties, setPurchasedProperties] = useState([]);
    const token = useSelector(selectToken);

    useEffect(() => {
        const fetchPurchasedProperties = async () => {
            try {
                const response = await axios.get('https://realestate-9evw.onrender.com/api/buyer/purchased-properties', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setPurchasedProperties(response.data);
            } catch (error) {
                toast.error('Failed to fetch purchased properties');
            }
        };

        fetchPurchasedProperties();
    }, [token]);

    return (
        <div>
            <h1>Purchased Properties</h1>
            {purchasedProperties.length > 0 ? (
                purchasedProperties.map(property => (
                    <div key={property._id}>
                        <h2>{property.title}</h2>
                        <p>{property.location}</p>
                        <p>{property.price}</p>
                        <img src={property.image} alt={property.title} />
                        <p>{property.description}</p>
                        <p>Purchased on: {new Date(property.purchaseDate).toLocaleDateString()}</p>
                    </div>
                ))
            ) : (
                <p>No properties purchased yet.</p>
            )}
        </div>
    );
};

export default PurchasedPropertiesPage; 