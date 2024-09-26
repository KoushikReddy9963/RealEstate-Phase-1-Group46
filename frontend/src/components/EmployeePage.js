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
        container: {
            maxWidth: '600px',
            margin: '0 auto',
            marginTop: '-10px',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        },
        title: {
            marginBottom: '10px',
            fontSize: '24px',
            fontWeight: 'bold',
        },
        inputt: {
            height: '50px',
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
        },
        inp: {
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
        },
        preview: {
            width: '100%',
            maxHeight: '300px',
            marginBottom: '10px',
            objectFit: 'cover',
        },
        head: {
            fontSize: '30px',
            marginTop: '20px',
            color: 'black',
        },
        button: {
            padding: '10px 15px',
            backgroundColor: '#40434E',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginLeft: '40%',
        },
        error: {
            color: 'red',
            marginBottom: '10px',
        },
        maincontainer: {
            height: '100vh',
            width: '100vw',
            background: 'linear-gradient(135deg, #71b7e6, #9b59b6)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        footer: {
            width: '100%',
            textAlign: 'center',
            padding: '10px',
            backgroundColor: '#40434E',
            color: 'white',
            fontSize: '16px',
            position: 'relative',
            bottom: 0,
        },
    };
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div style={styles.container}>
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

            <h1 style={styles.head}>Employee Page</h1>
            <div style={styles.container}>
                <h1 style={styles.title}>Add Advertisement</h1>
                {errorMessage && <div style={styles.error}>{errorMessage}</div>} {/* Display error message */}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={styles.inputt}
                        required
                    />
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={handleFileChange}
                        style={styles.inp}
                        required
                    />

                    {/* Preview the selected image */}
                    {preview && <img src={preview} alt="Preview" style={styles.preview} />}

                    <button type="submit" style={styles.button}>Submit</button>
                </form>
            </div>

            {/* Footer */}
            <div style={styles.footer}>
                For better Advertising Management..
            </div>
        </div>
    );
};

export default EmployeePage;