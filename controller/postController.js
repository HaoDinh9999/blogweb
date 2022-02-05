const Post = require("../models/Post");
//CREATE POST
exports.createPost = async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
};
//UPDATE POST
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.email === req.body.email) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.email === req.body.email) {
      try {
        await post.delete();
        res.status(200).json("Post has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can delete only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.getAllPost = async (req, res) => {
  const email = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;
    if (email) {
      posts = await Post.find({ email });
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.getTopWriter = async (req, res) => {
  try {
    const stats = await Post.aggregate([
      {
        $group: {
          _id: "$email",
          numPost: { $sum: 1 },
        },
      },
      {
        $sort: { numPost: -1 },
      },
    ]);
    res.status(200).json({
      status: "success",
      data: stats,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};
exports.getPostPerMonthOfYear = async (req, res) => {
  const year = req.params.year * 1;
  console.log(year);

  try {
    const plan = await Post.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          titles: { $push: "$title" },
          ids: { $push: "$_id" },
          numPost: { $sum: 1 },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $sort: { month: 1 },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: plan,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};
