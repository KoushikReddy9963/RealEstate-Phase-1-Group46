import axios from 'axios';
import { jwtDecode } from 'jwt-decode';  

export const login = async (email, password) => {
    try {
        const response = await axios.post('https://real-estate-delta-tawny.vercel.app/api/users/login', { email, password });
        const token = response.data.token;
        const decodedToken = jwtDecode(token);
        const user = { ...decodedToken, token };
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    } catch (error) {
        throw new Error('Invalid email or password');
    }
};

export const logout = () => {
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

export const isAuthenticated = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
};

export const getToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.token : null;
};

export const getUserRole = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.user && user.user.role ? user.user.role : null;
};

const authService = {
    login,
    logout,
    getCurrentUser,
    isAuthenticated,
    getToken,
    getUserRole
};

export default authService;
