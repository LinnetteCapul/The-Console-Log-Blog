const router = require('express').Router();
const { Blog, User } = require('../models');
const withAuth = require('../utils/auth');
const { Op } = require('sequelize');

router.get('/', async (req, res) => {
    try {
        const blogData = await Blog.findAll({
            include: [
                {
                    model: User,
                    attributes: ["username"]
                }
            ]
        })
        const blog = blogData.map((blog) => blog.get({ plain: true }));

        res.render('homepage', {
            blog,
            logged_in: req.session.logged_in,
            username: req.session.username,
        });
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get('/blogs/:id', async (req, res) => {
    try {
        const blogData = await Blog.findByPk(req.params.id)

        const blog = blogData.get({ plain: true });

        res.render('singleblogpage', {
            blog,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get('/search/:term', async (req, res) => {
    try {
        const blogData = await Blog.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.like]: '%' + req.params.term + '%' } },
                    { user_id: { [Op.like]: '%' + req.params.term + '%' } }
                ]
            }
        });

        const blog = blogData.map((blog) => blog.get({ plain: true }));

        res.render('blog', {
            blog,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get('/new/blog', withAuth, async (req, res) => {
    try {
        res.render('newblogpage', {
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.render('/');
        return;
    }

    res.render('login');
});

module.exports = router;