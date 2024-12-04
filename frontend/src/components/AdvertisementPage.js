import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaHome, FaRegClock, FaUser, FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const PageContainer = styled.div`
    padding: 20px;
    font-family: Arial, sans-serif;
    max-width: 1200px;
    margin: 0 auto;
    font-size: 16px;
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 40px;
    padding: 20px;

    h1 {
        font-size: 4rem;
        color: #2c3e50;
        margin-bottom: 20px;
        font-weight: bold;
    }

    p {
        font-size: 2rem;
        color: #34495e;
        line-height: 1.6;
    }
`;

const AdvertisementsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 35px;
    padding: 20px;
`;

const AdCard = styled.div`
    border: 1px solid #ddd;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;

    &:hover {
        transform: translateY(-5px);
    }

    img {
        width: 100%;
        height: 300px;
        object-fit: cover;
        display: block;
    }

    h2 {
        font-size: 2.5rem;
        margin: 20px;
        color: #2c3e50;
        font-weight: bold;
    }

    p {
        font-size: 1.8rem;
        margin: 20px;
        color: #34495e;
        line-height: 1.8;
    }

    .price {
        font-size: 2.4rem;
        font-weight: bold;
        color: #2980b9;
        margin: 20px;
    }

    .property-details {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 15px;
        border-top: 1px solid #eee;
        font-size: 1.6rem;
        background-color: #f9f9f9;
        border-radius: 8px;
    }

    .detail-item {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;

        svg {
            color: #2980b9;
            font-size: 1.8rem;
        }
    }
`;

const ImageContainer = styled.div`
    position: relative;
    width: 100%;
    height: 250px;
    overflow: hidden;
    
    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 50%;
        background: linear-gradient(to top, rgba(0,0,0,0.4), transparent);
    }
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }

    ${AdCard}:hover & img {
        transform: scale(1.1);
    }
`;

const PropertyType = styled.div`
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255, 255, 255, 0.9);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    color: #2c3e50;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const ContentContainer = styled.div`
    padding: 2rem;
`;

const Title = styled.h2`
    font-size: 1.8rem;
    color: #2c3e50;
    margin-bottom: 1rem;
    font-weight: 600;
    line-height: 1.3;
`;

const PropertyDetails = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin: 1.5rem 0;
    padding: 1.5rem 0;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
`;

const DetailItem = styled.div`
    display: flex;
    align-items: center;
    gap: 0.8rem;
    color: #596574;
    font-size: 1rem;
    
    svg {
        color: #3498db;
        font-size: 1.2rem;
    }
`;

const Price = styled.div`
    font-size: 1.8rem;
    color: #2ecc71;
    font-weight: 700;
    margin-top: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
        font-size: 1rem;
        color: #7f8c8d;
        font-weight: normal;
    }
`;

const Description = styled.p`
    color: #596574;
    font-size: 1rem;
    line-height: 1.8;
    margin: 1.5rem 0;
`;

const Footer = styled.footer`
    text-align: center;
    padding: 3rem;
    color: #596574;
    margin-top: 4rem;
    background: white;
    box-shadow: 0 -5px 20px rgba(0,0,0,0.05);
`;

const NoAds = styled.div`
    text-align: center;
    padding: 4rem;
    color: #596574;
    font-size: 1.2rem;
    background: white;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    margin: 2rem auto;
    max-width: 500px;
`;

const ContactInfo = styled.div`
    display: flex;
    gap: 20px;
    padding: 15px 20px;
    border-top: 1px solid #eee;
    
    .contact-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.6rem;
        color: #2980b9;
        
        svg {
            font-size: 1.8rem;
        }
    }
`;

const TimeStamp = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1.4rem;
    color: #7f8c8d;
    padding: 0 20px;

    svg {
        font-size: 1.6rem;
    }
`;

const AdvertisementPage = () => {
    const [advertisements, setAdvertisements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdvertisements = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/adv/Advertisement");
                console.log("Advertisement data:", response.data); // Debug log
                setAdvertisements(response.data);
            } catch (error) {
                console.error("Error fetching advertisements:", error);
                toast.error("Failed to fetch advertisements");
            } finally {
                setLoading(false);
            }
        };
        fetchAdvertisements();
    }, []);

    // Debug log to check image paths
    useEffect(() => {
        console.log("Current advertisements:", advertisements);
    }, [advertisements]);

    return (
        <PageContainer>
            <Header>
                <h1>Premium Properties</h1>
                <p>Discover extraordinary homes and exclusive real estate opportunities</p>
            </Header>

            <AdvertisementsGrid>
                {advertisements.map(ad => {
                    // Debug log for each advertisement
                    console.log("Processing ad:", ad);
                    console.log("Image path:", ad.property?.image);

                    return (
                        <AdCard key={ad._id}>
                            <img 
                                src={ad.property?.image?.startsWith('/9j') 
                                    ? `data:image/jpeg;base64,${ad.property.image}`
                                    : ad.property?.image 
                                        ? `http://localhost:5000/uploads/${ad.property.image}`
                                        : 'https://via.placeholder.com/400x300?text=Property+Image'
                                } 
                                alt={ad.property?.title || 'Property'} 
                                onError={(e) => {
                                    console.error("Image load error for:", ad.property?.image);
                                    e.target.src = 'https://via.placeholder.com/400x300?text=Property+Image';
                                }}
                            />
                            <h2>{ad.property?.title}</h2>
                            <div className="detail-item">
                                <FaMapMarkerAlt />
                                <span>{ad.property?.location}</span>
                            </div>
                            <p>{ad.property?.description}</p>
                            <div className="property-details">
                                <div className="detail-item">
                                    <FaBed />
                                    <span>{ad.property?.bedrooms} Beds</span>
                                </div>
                                <div className="detail-item">
                                    <FaBath />
                                    <span>{ad.property?.bathrooms} Baths</span>
                                </div>
                                <div className="detail-item">
                                    <FaRulerCombined />
                                    <span>{ad.property?.area} sqft</span>
                                </div>
                                <div className="detail-item">
                                    <FaHome />
                                    <span>{ad.property?.type}</span>
                                </div>
                            </div>
                            <TimeStamp>
                                <FaRegClock />
                                <span>Posted {new Date(ad.createdAt).toLocaleDateString()}</span>
                            </TimeStamp>
                            <ContactInfo>
                                <div className="contact-item">
                                    <FaUser />
                                    <span>{ad.employee?.name || 'Agent'}</span>
                                </div>
                                <div className="contact-item">
                                    <FaEnvelope />
                                    <span>{ad.employee?.email || 'Contact'}</span>
                                </div>
                            </ContactInfo>
                            <p className="price">Price: ${ad.property?.price?.toLocaleString()}</p>
                        </AdCard>
                    );
                })}
            </AdvertisementsGrid>
        </PageContainer>
    );
};

export default AdvertisementPage;
