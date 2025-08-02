const express = require('express');
const commentController = require('../controllers/commentController');
const authController = require('../controllers/userController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
    .route('/')
    .get(commentController.getAllComments)
    .post(
        authController.restrictTo('EndUser', 'SupportAgent', 'Admin'),
        commentController.setTicketUserIds,
        commentController.createComment
    );

router
    .route('/:id')
    .get(commentController.getComment)
    .patch(
        authController.restrictTo('SupportAgent', 'Admin'),
        commentController.updateComment
    )
    .delete(
        authController.restrictTo('SupportAgent', 'Admin'),
        commentController.deleteComment
    );

module.exports = router;
