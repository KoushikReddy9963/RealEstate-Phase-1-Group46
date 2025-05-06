import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { authStyles as styles } from '../styles/AuthStyles';
import { FaUser, FaLock } from 'react-icons/fa';
import { playLoginSound } from '../utils/soundEffects';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('https://realestate-9evw.onrender.com/api/users/login', { 
                email, 
                password 
            });

            if (response.data && response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data));
                await dispatch(loginUser(response.data));
                playLoginSound();

                const role = response.data.user.role.toLowerCase(); 
                console.log('Navigating to role:', role); 

                switch(role) {
                    case 'buyer':
                        navigate('/buyer');
                        break;
                    case 'seller':
                        navigate('/seller');
                        break;
                    case 'employee':
                        navigate('/employee');
                        break;
                    case 'admin':
                        navigate('/admin');
                        break;
                    default:
                        setError('Invalid user role');
                        console.error('Invalid role:', role);
                }
            } else {
                setError('Invalid response from server');
                console.error('Invalid response:', response.data);
            }
        } catch (err) {
            console.error('Login error:', err);
            if (err.response) {
                setError(err.response.data.message || 'Invalid email or password');
            } else if (err.request) {
                setError('Unable to connect to server. Please try again.');
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.floatingShape1}></div>
            <div style={styles.floatingShape2}></div>
            <div style={styles.floatingShape3}></div>
            <div style={styles.floatingShape4}></div>
            <div style={styles.formBox}>
                <h2 style={styles.header}>Welcome Back</h2>
                {error && <p style={styles.errorText}>{error}</p>}
                
                <form onSubmit={handleSubmit}>
                    <div style={styles.inputBox}>
                        <FaUser style={styles.icon} />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                ...styles.input,
                                textTransform: 'none'
                            }}
                        />
                    </div>

                    <div style={styles.inputBox}>
                        <FaLock style={styles.icon} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                ...styles.input,
                                textTransform: 'none'
                            }}
                        />
                    </div>

                    <button type="submit" style={styles.submitButton}>
                        Login
                    </button>

                    <p style={{ textAlign: 'center', marginTop: '20px' }}>
                        Don't have an account? {' '}
                        <Link to="/signup" style={styles.link}>
                            Sign Up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
