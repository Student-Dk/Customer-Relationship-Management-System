const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const bodyparser = require('body-parser');
const Newuser = require('./models/user');
const multer = require('multer');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { render } = require('ejs');


app.use(bodyparser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

//app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));



//---------------------data base connection------------------

mongoose.connect("mongodb://localhost:27017/CRM")
    .then(() => {
        console.log("Database connected successfully");
    }).catch((err) => {
        console.log("Error " + err);
    })

//------------------------------------------------------------






//---------------------------------------------------------
app.get('/', (req, res) => {

    res.render('home');

})

app.get('/reg', (req, res) => {
    res.render('reg');
})

//-----------------------------------------------------

app.post('/submit', async (req, res) => {
    try {
        const { name, contact, email, password } = req.body;
        const hashedpassword = await bcrypt.hash(password, saltRounds);
        const user = await fuser({ name, contact, email, password: hashedpassword });
        await user.save();
        res.render('login');
    } catch (err) {
        res.status(400).json({ error: err.message });
    }

})


//-----------------------------------------------
app.get('/login', (req, res) => {
    res.render('login');
})


// app.get('/dashboard', async(req, res) => {

    
//     res.render('dashboard',{user});
// })

//-------------------------------------------------
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        
        const user = await Newuser.findOne({ email, password });
        const userdata = await Newuser.find();
       
         if (!user) return res.status(400).json({ error: "invalid email " });
        const isMatch = await bcrypt.compare(password, user1.password);
        if (!isMatch) return res.status(400).json({ error: "invalid password" });

        if (user._id == '688a38f5bdf168b395ee94ee') return res.render('admin', { userdata });
        if (user._id != '688a38f5bdf168b395ee94ee') return res.render('dashboard',{user});


    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})


//--------------------------------------------------

app.get('/admin_login', (req, res) => {
    res.render('admin');
})

//------------------------------Delete-------------------------

app.post('/delete/:id', async (req, res) => {
    try {
        await Newuser.findByIdAndDelete(req.params.id)

        // const userdata = await Newuser.find();
        // res.render('admin', { userdata });
        res.redirect('/login');

    } catch (err) {
        console.log("error:" + err.message);
    }
})

//------------------------------edit------------------------------

app.get('/edit/:id', async (req, res) => {
    try {
        const user = await Newuser.findByIdAndUpdate(req.params.id);
        if (!user) return res.status(400).send('User not found');
        res.render('update', { user });

    } catch (err) {
        console.log("error:" + err);
    }
})

app.post('/update/:id', async (req, res) => {

    try {

        const { name, email, contact, gender } = req.body;

        await Newuser.findByIdAndUpdate(req.params.id, { name, email, contact, gender });

        const userdata = await Newuser.find();
        res.redirect('/login')


    } catch (err) {
        console.log("Error " + err);

    }
})

//-----change password------------
app.get('/change_password/:id', async (req, res) => {
    try {

        const user = await Newuser.findByIdAndUpdate(req.params.id);
        res.render('change_password', { user });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

app.post('/change_password/:id', async (req, res) => {
    try {
        const user = await Newuser.findByIdAndUpdate(req.params.id);  
        const { passwordo, passwordn, passwordc } = req.body;

        if (passwordo != user.password) return res.status(400).json({ message: "invalid old password" });
        if (passwordn != passwordc) return res.status(400).json({ message: "password not match" });
        const password = passwordc;

        await Newuser.findByIdAndUpdate(req.params.id, { password });
       res.redirect('/login');

    } catch (err) {
        console.log("error" + err);
    }
})
//------------------------user profile-------

app.get('/profile/:id',async(req,res)=>{
    const user= await Newuser.findByIdAndUpdate(req.params.id);
    res.render('userprofile',{user});
})

app.post('/updateprofile/:id',async(req,res)=>{
    // const{name,email,contact,gender,address}=req.body;
    try{
    await Newuser.findByIdAndUpdate(req.params.id,(req.body))
    res.redirect('/login');

    }catch(err){
        console.log("error"+err)
    }
})


//'''''''''''''''''''''''''
app.listen(1200, () => {
    console.log("server is running")

})
