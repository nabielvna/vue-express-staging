// controllers/accountController.js
const { User } = require('../models');
const bcrypt = require('bcrypt');
const fileService = require('../services/fileService');

const accountController = {
    async updateProfile(req, res) {
        try {
            const userId = req.user.id;

            // Get current user with Role included
            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found'
                });
            }

            // Handle file upload
            if (req.file) {
                try {
                    // Delete old profile picture if exists
                    if (user.profile_picture) {
                        await fileService.deleteFiles(user.profile_picture, 'profiles');
                    }

                    // Save new profile picture and get filename
                    const filename = await fileService.saveFiles(req.file, 'profiles');

                    // Update user profile_picture
                    await user.update({
                        profile_picture: filename
                    });
                } catch (error) {
                    console.error('Profile picture upload error:', error);
                    throw error;
                }
            }

            // Update other profile fields if provided
            const { nickname, name, phone_number } = req.body;
            const updateData = {};

            if (nickname !== undefined) updateData.nickname = nickname;
            if (name !== undefined) updateData.name = name;
            if (phone_number !== undefined) updateData.phone_number = phone_number;

            if (Object.keys(updateData).length > 0) {
                await user.update(updateData);
            }

            // Get updated user data with Role
            const updatedUser = await User.findByPk(userId, {
                include: {
                    association: 'Role',
                    attributes: ['id', 'name']
                }
            });

            res.json({
                status: 'success',
                message: 'Profile updated successfully',
                data: updatedUser
            });

        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                status: 'error',
                message: error.message || 'Failed to update profile'
            });
        }
    },

    async changeEmail(req, res) {
        try {
            const { email, password } = req.body;
            const userId = req.user.id;

            // Validate input
            if (!email || !password) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email and current password are required'
                });
            }

            // Get current user data
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found'
                });
            }

            // Verify current password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Current password is incorrect'
                });
            }

            // Check if email is already taken
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser && existingUser.id !== userId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email is already in use'
                });
            }

            // Update email
            await user.update({ email });

            return res.status(200).json({
                status: 'success',
                message: 'Email updated successfully'
            });
        } catch (error) {
            console.error('Change email error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to change email'
            });
        }
    },

    async changePassword(req, res) {
        try {
            const { current_password, new_password, confirm_password } = req.body;
            const userId = req.user.id;

            // Validate input
            if (!current_password || !new_password || !confirm_password) {
                return res.status(400).json({
                    status: 'error',
                    message: 'All password fields are required'
                });
            }

            if (new_password !== confirm_password) {
                return res.status(400).json({
                    status: 'error',
                    message: 'New passwords do not match'
                });
            }

            // Get current user data
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found'
                });
            }

            // Verify current password
            const isPasswordValid = await bcrypt.compare(current_password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Current password is incorrect'
                });
            }

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(new_password, salt);

            // Update password
            await user.update({ password: hashedPassword });

            // Revoke all refresh tokens
            await RefreshToken.revokeAllUserTokens(userId);

            return res.status(200).json({
                status: 'success',
                message: 'Password changed successfully. Please login again with your new password.'
            });
        } catch (error) {
            console.error('Change password error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to change password'
            });
        }
    }
};

module.exports = accountController;