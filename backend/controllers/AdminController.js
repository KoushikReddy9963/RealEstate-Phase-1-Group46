import User from '../models/User.js';
import Feedback from '../models/Feedback.js';
import Property from '../models/Property.js';

export const getAdminDashboardData = async (req, res) => {
    try {
        const users = await User.find();
        const feedbacks = await Feedback.find();
        const properties = await Property.find();
        const userCount = await User.countDocuments();
        const feedbackCount = await Feedback.countDocuments();
        const propertyCount = await Property.countDocuments();

        res.status(200).json({
            users,
            feedbacks,
            properties,
            counts: {
                users: userCount,
                feedbacks: feedbackCount,
                properties: propertyCount
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to delete user' });
    }
}