import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export const useLogoutHandler = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        
        dispatch(logoutUser());
        
        navigate('/');
    };

    return handleLogout;
}; 