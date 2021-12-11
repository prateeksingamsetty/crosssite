let express = require('express');
let path = require('path');
let User = require('./models/user')
let mongoose = require('mongoose');
let app = express();

//app.use(express.static(path.join(__dirname, './')));

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

//mongoDB connection
dbUrl = "mongodb+srv://prateek:prateek2606@freecluster.0qnz4.mongodb.net/crosssite";
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, function(error, script) {
    if (error) {
        console.log("error is ", err);
    } else {
        console.log("succesfully connected");
        //console.log(script)
    }
});

/*mongoose.connection.once('open', function() {
    console.log('connection has been made');
}).on('error', function(error) {
    console.log('error is ', error);
})*/

app.get('/', (req, res) => {
    res.send("HI");
})

app.get('/login', (req, res) => {
    res.render('login', { message: "" })
})

app.get('/signup', (req, res) => {
    res.render('signup')
})


app.post('/signup', (req, res) => {
    User.findOne({ email: req.body.email }).then((user) => {
        if (user) {
            return res.status(400).json({ email: "A user has already registered with this email" });
        } else {
            const newUser = new User({
                name: req.body.name,
                lname: req.body.lname,
                email: req.body.email,
                password: req.body.password
            });

            newUser.save();

            return res.status(200).json({ msg: newUser });
        }
    })
})

app.post('/login', (req, res) => {
    User.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
            //return res.status(400).json({ msg: "No registered users with this email" });
            res.render('login', { message: "no user with this email" });
        } else {
            //console.log(user);
            if (user.password === req.body.password) {
                res.render('secret', { message: "successfully logged in" });
            } else {
                res.render('login', { message: "login failed" });
            }
        }
    })
})

app.listen(3000, (req, res) => {
    console.log("connected successfully");
})