const router = require("express").Router();
const postCtrl = require("../controllers/post.controller");

// ACCESSING ALL POSTS
router.get("/", postCtrl.getAllPosts);

// ACCESSING A PARTICULAR COMMENT
router.get("/getcomment/:commentId/:id", postCtrl.getComment);

// ACCESSING A PARTICULAR POST
router.get("/:id", postCtrl.getPost);

// ACCESSING POSTS OF A PARTICULAR USER
router.get("/list/:username", postCtrl.getPostsByUser);

// ACCESSING A POST BY ID
router.get("/edit/:id", postCtrl.getPostById);

// REACTING TO A POST
router.post("/update/:react/:username", postCtrl.addReactionToPost);

// EDITING A POST
router.post("/edit/:id", postCtrl.editPost);

// ADDING NEW POST
router.post("/add", postCtrl.addPost);

// ADDING A COMMENT
router.post("/add/:id", postCtrl.addComment);

// REACTING TO A COMMENT
router.post("/comment/:react/:postId/:username", postCtrl.addReactionToComment);

// DELETE A COMMENT
router.post("/remove/:id", postCtrl.deleteComment);

// DELETING A POST
router.delete("/delete/:id", postCtrl.deletePost);

module.exports = router;