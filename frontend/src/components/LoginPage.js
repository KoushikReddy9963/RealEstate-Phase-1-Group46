import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { authStyles as styles } from '../styles/AuthStyles';
import { FaUser, FaLock } from 'react-icons/fa';
import { playLoginSound } from '../utils/soundEffects';

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
            playLoginSound();
            setTimeout(() => {
                const role = response.data.user.role;
                navigate(`/${role}`);
            }, 500);
        } catch (err) {
            setError('Invalid email or password');
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
                            style={styles.input}
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
                            style={styles.input}
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
