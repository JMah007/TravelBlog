const express = require("express");
const router = express.Router();
const blogController = require('../controllers/blogController'); // Handles requests to do with post related things

// all paths inside here are prefixed with /travelBlog/blogs already

router.post('/myBlogs/create', blogController.createBlogPost);
router.post("/update/:id", blogController.editBlogPost);
router.post("/subscribe/:targetUserId", blogController.subscribeUser);

router.delete("/delete/:id", blogController.deleteBlogPost);
router.delete("/unsubscribe/", blogController.unsubscribeUser);

router.get("/subscribedTo/:id", blogController.getSubscribedTo); 
router.get("/myBlogs/create", blogController.getCreatePost); 
router.get("/profile/:id", blogController.getUserProfilePosts); 
router.get("/myBlogs", blogController.getUserPosts); 
router.get("/edit/:id", blogController.getEditPost);
router.get("/", blogController.getAllBlogPosts); 
router.get("/users", blogController.getAllUsers); 
router.get("/:id", blogController.getPost); 


module.exports = router;
