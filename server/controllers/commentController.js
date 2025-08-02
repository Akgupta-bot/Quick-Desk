// controllers/commentController.js

const Comment = require('../models/commentModel');

// Middleware to set ticket and user IDs before creating a comment
exports.setTicketUserIds = (req, res, next) => {
    // Allow nested routes
    if (!req.body.ticket) req.body.ticket = req.params.ticketId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

exports.createComment = async (req, res) => {
    try {
        const newComment = await Comment.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                comment: newComment
            }
        });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.getAllComments = async (req, res) => {
    try {
        let filter = {};
        if (req.params.ticketId) filter = { ticket: req.params.ticketId };

        const comments = await Comment.find(filter);

        res.status(200).json({
            status: 'success',
            results: comments.length,
            data: {
                comments
            }
        });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.getComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'No comment found with that ID' });
        }
        res.status(200).json({ status: 'success', data: { comment } });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.updateComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!comment) {
            return res.status(404).json({ message: 'No comment found with that ID' });
        }
        res.status(200).json({ status: 'success', data: { comment } });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'No comment found with that ID' });
        }
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};
