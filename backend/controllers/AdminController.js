import User from "../models/User.js";
import Feedback from "../models/Feedback.js";
import Property from "../models/Property.js";
import bcrypt from "bcryptjs";
import redisClient from '../utils/redis.js';

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const userToDelete = await User.findById(id);
        if (!userToDelete) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        if (userToDelete.role === "admin") {
            return res
                .status(403)
                .json({ success: false, message: "Admins cannot be deleted" });
        }
        await User.findByIdAndDelete(id);
        res
            .status(200)
            .json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: "Failed to delete user" });
    }
};

export const deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const feedbackToDelete = await Feedback.findById(id);
        if (!feedbackToDelete) {
            return res.status(404).json({
                success: false,
                message: "Feedback not found",
            });
        }

        const deletedFeedback = await Feedback.findByIdAndDelete(id);

        if (!deletedFeedback) {
            return res.status(400).json({
                success: false,
                message: "Failed to delete feedback",
            });
        }

        res.status(200).json({
            success: true,
            message: "Feedback deleted successfully",
            deletedFeedback,
        });
    } catch (error) {
        console.error("Error deleting feedback:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting feedback",
            error: error.message,
        });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const start = Date.now();
        const {
            userDateFrom,
            userDateTo,
            propertyDateFrom,
            propertyDateTo,
            propertyStatus,
            userRole,
            feedbackDateFrom,
            feedbackDateTo,
        } = req.query;

        const allUsers = await User.find().select("-password");
        const totalCounts = {
            properties: await Property.countDocuments(),
            buyers: allUsers.filter((u) => u.role === "buyer").length,
            sellers: allUsers.filter((u) => u.role === "seller").length,
            employees: allUsers.filter((u) => u.role === "employee").length,
        };

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
        if (userRole && userRole !== "all") {
            userFilter.role = userRole;
        }

        let propertyFilter = {};
        if (propertyDateFrom || propertyDateTo) {
            propertyFilter.createdAt = {};
            if (propertyDateFrom)
                propertyFilter.createdAt.$gte = new Date(propertyDateFrom);
            if (propertyDateTo) {
                const endDate = new Date(propertyDateTo);
                endDate.setHours(23, 59, 59, 999);
                propertyFilter.createdAt.$lte = endDate;
            }
        }
        if (propertyStatus && propertyStatus !== "all") {
            propertyFilter.status = propertyStatus;
        }

        let feedbackFilter = {};
        if (feedbackDateFrom || feedbackDateTo) {
            feedbackFilter.createdAt = {};
            if (feedbackDateFrom)
                feedbackFilter.createdAt.$gte = new Date(feedbackDateFrom);
            if (feedbackDateTo) {
                const endDate = new Date(feedbackDateTo);
                endDate.setHours(23, 59, 59, 999);
                feedbackFilter.createdAt.$lte = endDate;
            }
        }

        const users = await User.find(userFilter).select("-password");
        const properties = await Property.find(propertyFilter).populate({
            path: "seller",
            select: "name email",
        });
        const feedbacks = await Feedback.find(feedbackFilter)
            .sort({ createdAt: -1 });

        const employees = allUsers.filter((u) => u.role === "employee");

        const stats = {
            users,
            properties,
            feedbacks,
            employees,
            totalCounts,
            employeeStats: {
                active: employees.filter((e) => e.status === "active").length,
                inactive: employees.filter((e) => e.status === "inactive").length,
                total: employees.length,
            },
            propertyStatus: {
                available: properties.filter((p) => p.status === "available").length,
                pending: properties.filter((p) => p.status === "pending").length,
                sold: properties.filter((p) => p.status === "sold").length,
            },
            recentProperties: properties.slice(0, 5),
        };

        const duration = Date.now() - start;
        console.log(`MongoDB query for dashboard-stats took ${duration}ms`);
        if (req.cacheKey) {
            try {
                await redisClient.setEx(req.cacheKey, 120, JSON.stringify(stats));
                console.log(`Cached response for ${req.cacheKey}`);
            } catch (err) {
                console.error(`Failed to cache ${req.cacheKey}:`, err.message);
            }
        }

        res.status(200).json(stats);
    } catch (error) {
        console.error("Dashboard stats error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const addEmployee = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newEmployee = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "employee",
            status: "active",
        });

        const { password: _, ...employeeData } = newEmployee.toObject();

        res.status(201).json({
            success: true,
            message: "Employee created successfully",
            data: employeeData,
        });
    } catch (error) {
        console.error("Error creating employee:", error);
        res.status(500).json({ message: "Failed to create employee" });
    }
};

export const deleteProperty = async (req, res) => {
    const { id } = req.params;
    try {
        const propertyToDelete = await Property.findById(id);
        if (!propertyToDelete) {
            return res
                .status(404)
                .json({ success: false, message: "Property not found" });
        }
        await Property.findByIdAndDelete(id);
        res
            .status(200)
            .json({ success: true, message: "Property deleted successfully" });
    } catch (error) {
        res
            .status(400)
            .json({ success: false, message: "Failed to delete property" });
    }
};
