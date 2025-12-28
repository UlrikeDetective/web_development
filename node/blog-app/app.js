const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let posts = [];

app.get('/', (req, res) => {
    res.render('index', { posts: posts });
});

app.get('/new-post', (req, res) => {
    res.render('new-post');
});

app.post('/new-post', (req, res) => {
    const post = { id: Date.now(), title: req.body.title, content: req.body.content,  author: req.body.author };
    posts.push(post);
    res.redirect('/');
});

app.get('/edit-post/:id', (req, res) => {
    const post = posts.find(p => p.id == req.params.id);
    if (post) {
        res.render('edit-post', { post: post });
    } else {
        res.redirect('/');
    }
});

app.post('/edit-post/:id', (req, res) => {
    const post = posts.find(p => p.id == req.params.id);
    if (post) {
        post.title = req.body.title;
        post.content = req.body.content;
    }
    res.redirect('/');
});

app.post('/delete-post/:id', (req, res) => {
    posts = posts.filter(p => p.id != req.params.id);
    res.redirect('/');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
