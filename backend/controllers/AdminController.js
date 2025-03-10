import User from '../models/User.js';
import Feedback from '../models/Feedback.js';
import Property from '../models/Property.js';
import Purchase from '../models/Purchase.js';

export const getAdminDashboardData = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        const properties = await Property.find()
            .populate({ path: 'seller', select: 'name email' });
        const feedbacks = await Feedback.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        const employees = users.filter(u => u.role === 'employee');

        const stats = {
            users,
            properties,
            feedbacks,
            employees,
            totalCounts: {
                properties: properties.length,
                buyers: users.filter(u => u.role === 'buyer').length,
                sellers: users.filter(u => u.role === 'seller').length,
                employees: employees.length
            },
            employeeStats: {
                active: employees.filter(e => e.status === 'active').length,
                inactive: employees.filter(e => e.status === 'inactive').length,
                total: employees.length
            },
            propertyStatus: {
                available: properties.filter(p => p.status === 'available').length,
                pending: properties.filter(p => p.status === 'pending').length,
                sold: properties.filter(p => p.status === 'sold').length
            },
            recentProperties: properties.slice(0, 5)
        };

        res.status(200).json(stats);
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const userToDelete = await User.findById(id);
        if (!userToDelete) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (userToDelete.role === 'admin') {
            return res.status(403).json({ success: false, message: 'Admins cannot be deleted' });
        }
        await User.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to delete user' });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const { userDateFrom, userDateTo, propertyDateFrom, propertyDateTo, propertyStatus, userRole } = req.query;

        let userFilter = {};
        if (userDateFrom || userDateTo) {
            userFilter.createdAt = {};
            if (userDateFrom) userFilter.createdAt.$gte = new Date(userDateFrom);
            if (userDateTo) {
                const endDate = new Date(userDateTo);
                endDate.setHours(23, 59, 59, 999);
                userFilter.createdAt.$lte = endDate;
            }
        }
        if (userRole) userFilter.role = userRole;

        let propertyFilter = {};
        if (propertyDateFrom || propertyDateTo) {
            propertyFilter.createdAt = {};
            if (propertyDateFrom) propertyFilter.createdAt.$gte = new Date(propertyDateFrom);
            if (propertyDateTo) propertyFilter.createdAt.$lte = new Date(propertyDateTo);
        }
        if (propertyStatus) propertyFilter.status = propertyStatus;

        const users = await User.find(userFilter).select('-password');
        const properties = await Property.find(propertyFilter)
            .populate({ path: 'seller', select: 'name email' });
        const feedbacks = await Feedback.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);
        const employees = users.filter(u => u.role === 'employee');

        const stats = {
            users,
            properties,
            feedbacks,
            employees,
            totalCounts: {
                properties: properties.length,
                buyers: users.filter(u => u.role === 'buyer').length,
                sellers: users.filter(u => u.role === 'seller').length,
                employees: employees.length
            },
            employeeStats: {
                active: employees.filter(e => e.status === 'active').length,
                inactive: employees.filter(e => e.status === 'inactive').length,
                total: employees.length
            },
            propertyStatus: {
                available: properties.filter(p => p.status === 'available').length,
                pending: properties.filter(p => p.status === 'pending').length,
                sold: properties.filter(p => p.status === 'sold').length
            },
            recentProperties: properties.slice(0, 5)
        };

        res.status(200).json(stats);
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ message: error.message });
    }
};
