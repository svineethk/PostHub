const express= require('express')
const bcrypt = require('bcrypt');
const router = express.Router()

const PostsRoutes = (db) => {

    router.get('/getPostArray',  async (req,res) => {
        const query = 'select * from posts';
        try{
            const response = await db.all(query);
            if (response && response.length > 0) {
                res.status(200).json({ posts: response });
            } else {
                res.status(404).json({ message: 'No posts found' });
            }
        }catch (error) {
            console.error('Error fetching posts:', error);
            res.status(500).json({ error: 'Error fetching posts from the database' });
        }

    })
    return router
}


module.exports= PostsRoutes