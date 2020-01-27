const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit');
const dateFormat = require('dateformat');

const app = express();
// create a db called message board
const db = monk(process.env.MONGO_URI || 'localhost/messageboard');
// create a collection called posts
const posts = db.get('posts');
const filter = new Filter();

app.use(cors());
app.use(express.json());

// Get and display all posts from db
app.get('/', (req,res) => {
    res.json({
        message: 'This is my api for postmessage!'
    });
});

app.get('/posts', (req,res) => {
    // query db then respond will all posts
    posts
        .find()
        .then(posts => {
            res.json(posts);
        });
});

// ensure data being inserted is not empty
function isValidPost(post){
    return post.name && post.name.toString().trim() !== '' &&
    post.content && post.content.toString().trim() !== '' 
}

app.use(rateLimit({
    windowMs: 30 * 1000, //30 seconds
    max: 1
}));

// Send post data to db
app.post('/posts', (req,res) =>{
    if (isValidPost(req.body)){
        const post = {
            name: filter.clean(req.body.name.toString().trim()),
            content: filter.clean(req.body.content.toString().trim()),
            created: dateFormat(new Date(),"mmmm dS, yyyy, h:MM:ss TT")
        };
        // insert into db
        posts
            .insert(post)
            .then(createdPost =>{
                res.json(createdPost);
            });
        console.log(post);
    } else {
        res.status(422);
        res.json({
            message: 'Name and message are required!'
        })
    }
});

// Set server port to 5000
app.listen(5000, ()=>{
    console.log('listening on http://localhost:5000');
})