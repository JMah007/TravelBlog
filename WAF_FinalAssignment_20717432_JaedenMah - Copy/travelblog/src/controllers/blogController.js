const post = require('../models/post');
const user = require('../models/user');
const subscription = require("../models/subscription");


const createBlogPost = async (req, res) => {
    console.log("Received tags:", req.body.tags);

    try {
        const tags = Array.isArray(req.body.tags)
            ? req.body.tags.map(tag => tag.trim())
            : req.body.tags ? [req.body.tags.trim()] : [];

        const newPost = new post({
            title: req.body.title,
            content: req.body.content,
            tags,
            createdBy: req.user.id,
            createdAt: new Date()
        });

        await newPost.save();
        res.json({ success: true, message: "Post created successfully", post: newPost, redirectTo: "/travelBlog/blogs/myBlogs"});
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });

    }
};


const editBlogPost = async (req, res) => {

    try {
        const updatedPost = await post.findByIdAndUpdate(
            req.params.id, 
            {
                title: req.body.title,
                content: req.body.content,
                tags: req.body.tags
            },
            { new: true }
        );

        if (!updatedPost) return res.status(404).send("Post not found");

        res.json({ success: true, message: "Post created successfully", post: updatedPost, redirectTo: "/travelBlog/blogs/myBlogs"});
    } catch (error) {
        console.error('Error updating blog post:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });

    }
};


const deleteBlogPost =  async function(req, res){ 
    try {
        const foundPost = await post.findById(req.params.id);
        if (!foundPost) return res.status(404).send("Post not found");

        await post.findByIdAndDelete(req.params.id);
        res.json({ success: true, redirectTo: "/travelBlog/blogs/myBlogs"});
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });

    }
}


// This grabs the post according to id and displays the edit form
const getEditPost = async function(req, res){
    try {
        const foundPost = await post.findById(req.params.id);
        if (!foundPost) return res.status(404).send("Post not found");

        // Ensure only the owner can edit
        if (!req.user._id.equals(foundPost.createdBy)) {
            res.status(403).json({ success: false, message: "Unauthorized to edit this post" });

        }

        res.json({ success: true, foundPost});
    } catch (error) {
        console.error("Error loading edit page:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}



const getAllBlogPosts = async function(req, res){
    try { // If any search exists then only show the blogs related to that
        const searchQuery = req.query.search ? req.query.search.trim() : "";
        const searchRegex = new RegExp(searchQuery, "i");

        const posts = searchQuery
            ? await post.find({ $or: [{ title: searchRegex }, { tags: searchRegex }] }).lean()
            : await post.find().lean();

        // Format time of creation
        posts.forEach(post => {
            post.formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", { 
                year: "numeric", month: "long", day: "numeric" 
            });
        });

        // Get authors username of post and attach it to the post
        const postsWithAuthors = await Promise.all(posts.map(async post => {
            const author = await user.findById(post.createdBy).lean();
            return { ...post, authorUsername: author.username};
        }));


        res.json({ success: true, postsWithAuthors}); 

    } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


const getAllUsers = async function (req, res) {
    try {
        const users = await user.find();  
        console.log("Fetched Users:", users);
        res.json({ success: true, users});
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


// Displays all posts created by the user of the session
const getUserPosts = async function(req, res){ 
    
    try {
        const searchQuery = req.query.search ? req.query.search.trim() : "";
        const searchRegex = new RegExp(searchQuery, "i");

        const posts = await post.find({
            createdBy: req.user._id, // Ensure filtering by the logged-in user
            $or: [
                { title: searchRegex },
                { tags: searchRegex }
            ]
        }).lean();
        
        // Format time of creation
        posts.forEach(post => {
            post.formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", { 
                year: "numeric", month: "long", day: "numeric" 
            });
        });

        const userName = req.user.username;

        res.json({ success: true, posts, userName }); 
    } catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


const getUserProfilePosts = async function(req, res) {
    try {
        const { id } = req.params; 

        const posts = await post.find({ createdBy: id }).lean(); 

        if (!posts || posts.length === 0) {
            return res.status(404).json({ success: false, message: "No posts found for this user" });
        }

        const profileUser = await user.findById(id); 

        res.json({ success: true, posts, profileUser });
    } catch (error) {
        console.error("Error fetching user profile posts:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



const getPost = async function(req, res) {
    try {
        const foundPost = await post.findById(req.params.id);

        if (!foundPost) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        const postCreatedBy = await user.findById(foundPost.createdBy);

        res.json({ success: true, foundPost, postCreatedBy});
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



const subscribeUser = async (req, res) => {
    try {
        const { targetUserId } = req.params;
        const { subscriberId } = req.body;

        const existingSubscription = await subscription.findOne({ subscriberId, targetUserId });
        
        if (existingSubscription) {
            res.status(201).json({ message: "Subscription successful", isSubscribed: true });
            return;
        }
        
        const newSubscription = new subscription({ subscriberId, targetUserId });
        await newSubscription.save();

        res.status(201).json({ message: "Subscription successful", isSubscribed: true });
    } catch (error) {
        console.error("Error subscribing user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const unsubscribeUser = async (req, res) => {
    try {

        const { subscriberId, targetUserId } = req.body; 

        const deletedSubscription = await subscription.findOneAndDelete({ subscriberId, targetUserId });

        if (!deletedSubscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }

        res.status(200).json({ message: "Unsubscribed successfully", isSubscribed: false });
    } catch (error) {
        console.error("Error unsubscribing user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



const getSubscribedTo = async function (req, res) {
    try {
        const subscriberId = req.params.id; 

        // Finds users they are subscribed to and adds that users username
        const listSubscribedTo = await subscription.find({ subscriberId }).populate("targetUserId");

        res.status(200).json({ listSubscribedTo });
    } catch (error) {
        console.error("Error fetching subscriptions:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const getCreatePost = function(req, res){
    res.render('createPost');
}

module.exports = { getSubscribedTo, createBlogPost, editBlogPost, deleteBlogPost, getEditPost, getAllBlogPosts, getAllUsers, getUserPosts, getPost, getCreatePost, getUserProfilePosts, subscribeUser, unsubscribeUser};