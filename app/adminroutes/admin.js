var express = require('express');
var router = express.Router();
var passport = require('passport');

/*
* GET login
*/
router.get('/login', function (req, res) {
     if(res.locals.user) res.redirect('/')
    res.render('login')
}); 

/*
* Post Login
*/

router.post('/login',function(req,res,next){
    passport.authenticate('local',{
        successRedirect:'/admin/dashboard',
        failureRedirect:'/admin/login',
        failureFlash:true
    })(req,res,next)
});

/*
* Get logout
*/
router.get('/logout',function(req,res){
    req.logout();

    req.flash('success','You are log out');
    res.redirect('/admin/login')
})


//Export
module.exports = router; 