import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
            localStorage.setItem('user', JSON.stringify(response.data));
            const role = response.data.user.role;
            if (role === 'admin') {
                navigate('/admin');
            } else if (role === "buyer") {
                navigate('/buyer');
            } else if (role === 'seller') {
                navigate('/seller');
            } else if (role === 'employee') {
                navigate('/employee');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f4f4f4',
        },
        box: {
            backgroundColor: '#fff',
            padding: '40px 30px',
            borderRadius: '12px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            width: '100%',
            maxWidth: '400px',
        },
        h2: {
            marginBottom: '20px',
            fontSize: '28px',
            color: '#333',
        },
        inputGroup: {
            marginBottom: '20px',
            textAlign: 'left',
        },
        label: {
            fontSize: '14px',
            color: '#555',
            marginBottom: '8px',
            display: 'block',
        },
        input: {
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '16px',
            backgroundColor: '#fafafa',
            textTransform: 'none',  // Ensures normal text input
        },
        inputFocus: {
            outline: 'none',
            borderColor: '#007bff',
            backgroundColor: '#fff',
        },
        errorText: {
            color: '#e74c3c',
            fontSize: '14px',
            marginBottom: '20px',
        },
        button: {
            width: '100%',
            padding: '12px',
            backgroundColor: '#007bff',
            color: '#fff',
            fontSize: '16px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
        },
        buttonHover: {
            backgroundColor: '#0056b3',
        },
        signupText: {
            marginTop: '20px',
            fontSize: '14px',
        },
        link: {
            color: '#007bff',
            textDecoration: 'none',
            fontWeight: 'bold',
        },
        linkHover: {
            textDecoration: 'underline',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <h2 style={styles.h2}>Login</h2>
                {error && <p style={styles.errorText}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <button
                        type="submit"
                        style={styles.button}
                        onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                        onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                    >
                        Login
                    </button>
                </form>
                <p style={styles.signupText}>
                    Don't have an account? <Link to="/signup" style={styles.link}>Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
