const router = require('express').Router();

const userController = require('../controllers/user');
const { isAuthenticated } = require('../middlewares/auth');

router.get('/:username', userController.getUserByUsername);
router.get('/:id/posts', userController.getPostsByUser);
router.get('/:id/posts/liked', userController.getLikedPostsByUser);
router.patch('/follow', isAuthenticated, userController.followUser);
router.patch('/unfollow', isAuthenticated, userController.unFollowUser);
router.get('/:id/followers', isAuthenticated, userController.getFollowersList);
router.get('/:id/followees', isAuthenticated, userController.getFolloweesList);

module.exports = router;
