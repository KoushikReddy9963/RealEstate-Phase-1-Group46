import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../services/AuthService';

const EmployeePage = () => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null); // State for image preview
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));  // Set preview URL
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('image', image);

        try {
            const token = getToken();
            console.log('Token being sent:', token);  // Debug: Check token value
            const response = await axios.post('http://localhost:5000/api/employee/advertisement', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('Advertisement added:', response.data);
            setTitle('');
            setImage(null);
            setPreview(null);  // Clear preview after successful submission
            setErrorMessage('');  // Clear previous error message
        } catch (error) {
            console.error("Error adding advertisement:", error.response?.data);
            setErrorMessage(error.response?.data?.message || 'An error occurred.');  // Set error message state
        }
    };

    const styles = {
        pageContainer: {
            minHeight: '100vh',
            background: 'linear-gradient(to right, #f8f9fa, #e9ecef)',
            padding: '40px 20px',
        },
        container: {
            maxWidth: '800px',
            margin: '0 auto',
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
        },
        header: {
            textAlign: 'center',
            marginBottom: '30px',
        },
        title: {
            fontSize: '28px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '20px',
        },
        form: {
            display: 'grid',
            gap: '20px',
        },
        input: {
            padding: '12px',
            border: '1.5px solid #999',
            borderRadius: '8px',
            fontSize: '16px',
            transition: 'all 0.3s ease',
            width: '100%',
            '&:focus': {
                borderColor: '#007bff',
                boxShadow: '0 0 0 2px rgba(0, 123, 255, 0.2)',
                outline: 'none',
            },
        },
        fileInput: {
            padding: '12px',
            border: '1.5px solid #999',
            borderRadius: '8px',
            backgroundColor: '#f8f9fa',
        },
        preview: {
            width: '100%',
            maxHeight: '300px',
            objectFit: 'contain',
            borderRadius: '8px',
            marginTop: '10px',
        },
        button: {
            padding: '14px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            width: '100%',
            '&:hover': {
                backgroundColor: '#0056b3',
                transform: 'translateY(-1px)',
            },
        },
        logoutButton: {
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            '&:hover': {
                backgroundColor: '#c82333',
            },
        },
    };
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div style={styles.pageContainer}>
            <button
                style={styles.logoutButton}
                onClick={handleLogout}
            >
                Logout
            </button>

            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Advertisement Management</h1>
                </div>
                
                {errorMessage && (
                    <div style={{
                        padding: '12px',
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        textAlign: 'center'
                    }}>
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="text"
                        placeholder="Advertisement Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={styles.input}
                        required
                    />
                    
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={handleFileChange}
                        style={styles.fileInput}
                        required
                    />
                    
                    {preview && <img src={preview} alt="Preview" style={styles.preview} />}
                    
                    <button type="submit" style={styles.button}>
                        Submit Advertisement
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EmployeePage;