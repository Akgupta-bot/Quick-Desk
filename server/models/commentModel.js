const mongoose = require('mongoose');
const Ticket = require('./ticketModel');

const commentSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Comment cannot be empty.'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    ticket: {
        type: mongoose.Schema.ObjectId,
        ref: 'Ticket',
        required: [true, 'Comment must belong to a ticket.'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Comment must belong to a user.'],
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Set ticket's updatedAt field when a new comment is made
commentSchema.post('save', async function () {
    await Ticket.findByIdAndUpdate(this.ticket, { updatedAt: Date.now() });
});

commentSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name role'
    });
    next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
