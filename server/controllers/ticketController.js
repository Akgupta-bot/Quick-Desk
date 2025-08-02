const multer = require('multer');
const Ticket = require('../models/ticketModel');
const APIFeatures = require('../utils/apiFeatures');
// const sendEmail = require('../utils/email');

// --- Multer Configuration for File Uploads ---

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    // Allow any file type for now, but you could restrict it, e.g., to images or PDFs
    // if (file.mimetype.startsWith('image')) {
    //   cb(null, true);
    // } else {
    //   cb(new Error('Not an image! Please upload only images.'), false);
    // }
    cb(null, true);
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadTicketAttachments = upload.array('attachments', 5); // Field name 'attachments', max 5 files

exports.processTicketAttachments = (req, res, next) => {
    if (!req.files) return next();

    req.body.attachments = [];
    req.files.forEach(file => {
        // In a real app, you would upload this to a cloud service (S3, etc.)
        // and save the URL. For now, we'll just save a placeholder name.
        const filename = `ticket-${req.user.id}-${Date.now()}-${file.originalname}`;
        req.body.attachments.push(filename);
        // Add logic here to save the file buffer (file.buffer) to disk or cloud.
    });

    next();
};


// --- Route Handlers ---

exports.createTicket = async (req, res) => {
    try {
        const newTicket = await Ticket.create({
            subject: req.body.subject,
            description: req.body.description,
            category: req.body.category,
            attachments: req.body.attachments,
            createdBy: req.user.id
        });

        // Example of sending an email notification
        // await sendEmail({
        //     email: req.user.email,
        //     subject: `[Ticket ID: ${newTicket._id}] Your ticket has been created`,
        //     message: `Hi ${req.user.name},\n\nYour support ticket titled "${newTicket.subject}" has been successfully created. Our team will get back to you shortly.\n\nThank you,\nQuickDesk Support`
        // }).catch(console.error); // Log email errors without stopping the response

        res.status(201).json({
            status: 'success',
            data: {
                ticket: newTicket
            }
        });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.getAllTickets = async (req, res) => {
    try {
        let filter = {};
        // EndUsers can only see their own tickets
        if (req.user.role === 'EndUser') {
            filter = { createdBy: req.user.id };
        }

        const features = new APIFeatures(Ticket.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const tickets = await features.query.populate('category createdBy assignedTo');

        res.status(200).json({
            status: 'success',
            results: tickets.length,
            data: {
                tickets
            }
        });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.getTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id)
            .populate('comments') // Populate comments via virtual populate
            .populate('category createdBy assignedTo');

        if (!ticket) {
            return res.status(404).json({ message: 'No ticket found with that ID' });
        }

        // Authorization check: User can see their own ticket, Admins/Agents can see all
        if (req.user.role === 'EndUser' && ticket.createdBy.id.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to view this ticket.' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                ticket
            }
        });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.updateTicket = async (req, res) => {
    try {
        // Agents/Admins can't update fields they shouldn't
        const filteredBody = { ...req.body };
        delete filteredBody.createdBy;
        delete filteredBody.upvotes;
        delete filteredBody.downvotes;

        const ticket = await Ticket.findByIdAndUpdate(req.params.id, filteredBody, {
            new: true,
            runValidators: true
        }).populate('createdBy');

        if (!ticket) {
            return res.status(404).json({ message: 'No ticket found with that ID' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                ticket
            }
        });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.deleteTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndDelete(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'No ticket found with that ID' });
        }
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.assignTicketToMe = async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id,
            { assignedTo: req.user.id, status: 'In Progress' },
            { new: true, runValidators: true }
        );

        if (!ticket) {
            return res.status(404).json({ message: 'No ticket found with that ID' });
        }

        res.status(200).json({
            status: 'success',
            message: `Ticket assigned to ${req.user.name}`,
            data: { ticket }
        });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.getMyTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ assignedTo: req.user.id });
        res.status(200).json({
            status: 'success',
            results: tickets.length,
            data: { tickets }
        });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.voteOnTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'No ticket found with that ID' });
        }

        const { voteType } = req.body; // 'upvote' or 'downvote'
        const userId = req.user.id;

        if (voteType === 'upvote') {
            ticket.upvotes.addToSet(userId); // Use addToSet to prevent duplicates
            ticket.downvotes.pull(userId);
        } else if (voteType === 'downvote') {
            ticket.downvotes.addToSet(userId);
            ticket.upvotes.pull(userId);
        } else {
            return res.status(400).json({ message: 'Invalid vote type.' });
        }

        await ticket.save();
        res.status(200).json({
            status: 'success',
            data: { ticket }
        });

    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};
