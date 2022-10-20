let router = require("express").Router();
let postCtrl = require("../controllers/post.controller");
let auth = require("../middleware/auth");

// ACCESSING ALL POSTS
router.get("/", () => {postCtrl.getAllPosts});

// ACCESSING A PARTICULAR COMMENT
router.get("/getcomment/:commentId/:id", postCtrl.getComment);

// ACCESSING A PARTICULAR POST
router.get("/:id", postCtrl.getPost);

// ACCESSING POSTS OF A PARTICULAR USER
router.get("/list/:username", postCtrl.getPostsByUser);

// ACCESSING A POST BY ID
router.get("/edit/:id", postCtrl.getPostById);

// REACTING TO A POST
router.post("/update/:react/:username", auth, postCtrl.addReactionToPost);

// EDITING A POST
router.post("/edit/:id", auth, postCtrl.editPost);

// ADDING NEW POST
router.post("/add", auth, postCtrl.addPost);

// ADDING A COMMENT
router.post("/add/:id", auth, postCtrl.addComment);

// REACTING TO A COMMENT
router.post("/comment/:react/:postId/:username", auth, postCtrl.addReactionToComment);

// DELETE A COMMENT
router.post("/remove/:id/:username", auth, postCtrl.deleteComment);

// DELETING A POST
router.delete("/delete/:id/:username", auth, postCtrl.deletePost);

module.exports = router;