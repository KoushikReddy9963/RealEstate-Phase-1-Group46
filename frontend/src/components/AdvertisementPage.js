import React, { useEffect, useState } from "react";
import axios from "axios";

const AdvertisementPage = () => {
    const [advertisements, setAdvertisements] = useState([]);

    useEffect(() => {
        const fetchAdvertisements = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/adv/Advertisement");
                console.log('Raw advertisements response:', response.data);
                
                if (!Array.isArray(response.data)) {
                    console.error('Expected array of advertisements, got:', response.data);
                    return;
                }

                const validAds = response.data.filter(ad => {
                    const isValid = ad && ad.property && ad.content;
                    if (!isValid) {
                        console.warn('Invalid advertisement:', ad);
                    }
                    return isValid;
                });

                console.log('Valid advertisements:', validAds);
                setAdvertisements(validAds);
            } catch (error) {
                console.error("Error fetching advertisements:", error);
                console.error('Full error:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });
            }
        };
        fetchAdvertisements();
    }, []);

    const styles = {
        page: {
            backgroundColor: '#f5f5f5',
            minHeight: '100vh',
            position: 'relative',
            paddingBottom: '100px', // Padding to prevent overlap with the footer
        },
        heroSection: {
            height: '100vh', // Full viewport height for the image section
            backgroundImage: 'url(https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?fit=crop&w=1920&q=80)', // Replace with your image URL
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            textAlign: 'center',
            padding: '20px',
        },
        heroContent: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)', // Adds a semi-transparent overlay behind the text for readability
            padding: '20px',
            borderRadius: '8px',
        },
        title: {
            fontSize: '3rem',
            fontWeight: 'bold',
        },
        subtitle: {
            fontSize: '1.5rem',
            marginTop: '10px',
        },
        scrollContainer: {
            paddingTop: '20px',
            paddingBottom: '60px',
            marginTop: '-100px', // Pulls the container up to visually connect with the image
            zIndex: '1', // Ensure the scrollable content is above the background
        },
        container: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
            padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slight transparency for a smoother transition
            borderRadius: '12px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            margin: '0 auto',
            width: '90%',
            maxWidth: '1200px',
        },
        card: {
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '15px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s',
            cursor: 'pointer',
            backgroundColor: '#fff',
        },
        titleDateContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '0 0 10px 0',
        },
        cardTitle: {
            fontSize: '1.5rem',
            marginRight: '10px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        date: {
            fontSize: '0.85rem',
            color: '#888',
            whiteSpace: 'nowrap',
        },
        image: {
            width: '100%',
            height: '300px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginBottom: '15px',
            backgroundColor: '#f0f0f0',
        },
        footer: {
            position: 'absolute',
            bottom: 0,
            width: '100%',
            textAlign: 'center',
            backgroundColor: '#333',
            color: 'white',
            padding: '20px 0',
        },
        footerContent: {
            width: '80%',
            margin: '0 auto',
        },
        propertyDetails: {
            padding: '15px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '8px',
            marginTop: '15px',
        },
        detailRow: {
            display: 'flex',
            alignItems: 'center',
            margin: '8px 0',
            fontSize: '1.1rem',
            color: '#333',
        },
        detailLabel: {
            fontWeight: 'bold',
            minWidth: '120px',
            color: '#2c5282',
        },
        price: {
            fontSize: '1.4rem',
            color: '#2c5282',
            fontWeight: 'bold',
            marginTop: '10px',
        },
        amenities: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginTop: '10px',
        },
        amenityTag: {
            backgroundColor: '#e2e8f0',
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '0.9rem',
        },
    };

    return (
        <div style={styles.page}>
            <div style={styles.heroSection}>
                <div style={styles.heroContent}>
                    <h1 style={styles.title}>Featured Properties</h1>
                    <p style={styles.subtitle}>Discover Your Perfect Home</p>
                </div>
            </div>

            <div style={styles.scrollContainer}>
                <div style={styles.container}>
                    {advertisements.length > 0 ? (
                        advertisements.map(ad => (
                            <div
                                key={ad._id}
                                style={styles.card}
                                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-5px)')}
                                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                            >
                                {ad.property && ad.property.image ? (
                                    <img
                                        src={ad.property.image.startsWith('data:') ? 
                                            ad.property.image : 
                                            `data:image/jpeg;base64,${ad.property.image}`}
                                        alt={ad.title || 'Property image'}
                                        style={styles.image}
                                        onError={(e) => {
                                            console.error('Image load error for property:', ad.property._id);
                                            e.target.src = 'https://via.placeholder.com/400x300?text=Property+Image';
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        ...styles.image,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#f0f0f0',
                                        color: '#666',
                                        fontSize: '1.1rem'
                                    }}>
                                        No Image Available
                                    </div>
                                )}
                                
                                <div style={styles.titleDateContainer}>
                                    <h2 style={styles.cardTitle}>{ad.title || 'Untitled Property'}</h2>
                                    <span style={styles.date}>
                                        {ad.createdAt ? new Date(ad.createdAt).toLocaleDateString() : 'Date not available'}
                                    </span>
                                </div>

                                {ad.property && (
                                    <div style={styles.propertyDetails}>
                                        <div style={styles.price}>
                                            ₹{ad.property.price?.toLocaleString() || 'Price on request'}
                                        </div>
                                        
                                        <div style={styles.detailRow}>
                                            <span style={styles.detailLabel}>Location:</span>
                                            <span>{ad.property.location || 'Location not specified'}</span>
                                        </div>
                                        
                                        <div style={styles.detailRow}>
                                            <span style={styles.detailLabel}>Property Type:</span>
                                            <span>{ad.property.propertyType || 'Property type not specified'}</span>
                                        </div>
                                        
                                        <div style={styles.detailRow}>
                                            <span style={styles.detailLabel}>Area:</span>
                                            <span>{ad.property.area || 'Area not specified'} sq ft</span>
                                        </div>
                                        
                                        <div style={styles.detailRow}>
                                            <span style={styles.detailLabel}>Bedrooms:</span>
                                            <span>{ad.property.bedrooms || 'Bedrooms not specified'}</span>
                                        </div>
                                        
                                        <div style={styles.detailRow}>
                                            <span style={styles.detailLabel}>Bathrooms:</span>
                                            <span>{ad.property.bathrooms || 'Bathrooms not specified'}</span>
                                        </div>
                                        
                                        <div style={styles.detailRow}>
                                            <span style={styles.detailLabel}>Status:</span>
                                            <span>{ad.property.status || 'Status not specified'}</span>
                                        </div>

                                        {ad.property.amenities && (
                                            <>
                                                <div style={styles.detailRow}>
                                                    <span style={styles.detailLabel}>Amenities:</span>
                                                </div>
                                                <div style={styles.amenities}>
                                                    {ad.property.amenities.map((amenity, index) => (
                                                        <span key={index} style={styles.amenityTag}>
                                                            {amenity}
                                                        </span>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                        
                                        {ad.property.description && (
                                            <div style={styles.detailRow}>
                                                <span style={styles.detailLabel}>Description:</span>
                                                <span>{ad.property.description || 'Description not available'}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No advertisements available.</p>
                    )}
                </div>
            </div>

            <footer style={styles.footer}>
                <div style={styles.footerContent}>
                    © 2024 Real Estate Portal | All rights reserved
                </div>
            </footer>
        </div>
    );
};

export default AdvertisementPage;