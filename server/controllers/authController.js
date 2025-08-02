const express = require('express');
const User = require('../models/userModel');

exports.signup = async (req, res) => {
    {
        const { name, email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (user) return res.status(400).json({ msg: 'User already exists' });

            user = new User({ name, email, password });
            await user.save();

            // Set session
            req.session.userId = user._id;
            res.status(201).json({ msg: 'Signup successful', user: { name, email } });
        } catch (err) {
            res.status(500).json({ msg: 'Server error' });
        }
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        // Set session
        req.session.userId = user._id;
        res.json({ msg: 'Login successful', user: { name: user.name, email } });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
}

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ msg: 'Logout failed' });
        res.clearCookie('connect.sid');
        res.json({ msg: 'Logged out successfully' });
    });
}