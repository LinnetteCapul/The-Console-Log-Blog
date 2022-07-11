const { Blog, User, Comment } = require("../models");
const sequelize = require("../config/connection");
const blogData = require("./blogData.json");
const userData = require("./userData.json");
const commentData = require("./commentData.json");

//WIP - Comment
const seedAll = async () => {
    await sequelize.sync({ force: true });

    await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });
    await Blog.bulkCreate(blogData);
    await Comment.bulkCreate(commentData);

    process.exit(0);
};

seedAll();