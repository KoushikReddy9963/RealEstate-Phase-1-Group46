import React, { useEffect, useState } from "react";
import axios from "axios";

const AdvertisementPage = () => {
    const [advertisements, setAdvertisements] = useState([]);

    useEffect(() => {
        const fetchAdvertisements = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/adv/Advertisement");
                setAdvertisements(response.data);
            } catch (error) {
                console.error("Error fetching advertisements:", error);
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
            height: '200px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginBottom: '10px',
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
    };

    return (
        <div style={styles.page}>
            {/* Hero section with background image and content */}
            <div style={styles.heroSection}>
                <div style={styles.heroContent}>
                    <h1 style={styles.title}>Welcome to Advertisement Page</h1>
                    <p style={styles.subtitle}>Discover the best deals and offers here</p>
                </div>
            </div>

            {/* Scrollable content for advertisements */}
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
                                <img
                                    src={`data:image/jpeg;base64,${ad.content}`}
                                    alt={ad.title}
                                    style={styles.image}
                                />
                                <div style={styles.titleDateContainer}>
                                    <h2 style={styles.cardTitle}>{ad.title}</h2>
                                    <span style={styles.date}>
                                        {new Date(ad.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No advertisements available.</p>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer style={styles.footer}>
                <div style={styles.footerContent}>
                    © 2024 Real Estate Portal | All rights reserved
                </div>
            </footer>
        </div>
    );
};

export default AdvertisementPage;
