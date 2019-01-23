var express = require('express');
var router = express.Router();
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var resizeImg = require('resize-img');
var auth = require('../config/auth');
var csv = require('fast-csv');
var mongoose = require('mongoose');

var isAdmin = auth.isAdmin;

// Get newUser model
var Courses = require('../models/author');

// Get User Index

router.get('/', isAdmin, function (req, res) {
    //var count;
    // Courses.countDocuments(function(err,c){
    //     count = c;
    // })
    Courses.count(function (err, c) {
        count = c;
    })
    // Courses.estimatedDocumentCount(err, (c)=>{
    //     count = c;
    // } )

    Courses.find(function (err, courses) {
        res.render('admin/csvupload', {
            courses: courses,
            count: count
        });
    });

});

// // Get Add User
router.get('/add-csv', isAdmin, function (req, res) {
    res.render('admin/add_csv', {

    });
});

// // Post Add User
router.post('/add-csv', function (req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    var authorFile = req.files.file;

    var authors = [];
    csv
        .fromString(authorFile.data.toString(), {
            headers: true,
            ignoreEmpty: true
        })
        .on("data", function (data) {
            data['_id'] = new mongoose.Types.ObjectId();

            authors.push(data);
        })
        .on("end", function () {
            Courses.create(authors, function (err, documents) {
                if (err) throw err;
            });

            req.flash('success', 'Product added');
            res.redirect('/admin/csvupload');
        });
})

// //Get Edit User

router.get('/edit-csv/:id', isAdmin, function (req, res) {
    var errors;
    if (req.session.errors)
        errors = req.session.errors;

    req.session.errors = null;

    Courses.findById(req.params.id, function (err, p) {
        if (err) {
            console.log(err);
            res.redirect('/admin/csvupload')
        } else {
            res.render('admin/edit_csv', {
                course_id: p.course_id,
                errors: errors,
                course_name: p.course_name,
                course_fees: p.course_fees,
                faculty_name: p.faculty_name,
                id: p._id
            });
        }
    });


});

// Post Edit User

router.post('/edit-csv/:id', function (req, res) {   
    var course_id = req.body.course_id;
    var course_name = req.body.course_name;
    var course_fees = req.body.course_fees;
    var faculty_name = req.body.faculty_name;
    var id = req.params.id;
    var errors = req.validationErrors();
    if (errors) {
        req.session.errors = errors;
        res.redirect('/admin/csvupload/edit-csv/' + id);
    } else {
        Courses.findById(id, function (err, p) {
            if (err) console.log(err);
            p.course_id = course_id;
            p.course_name = course_name;
            p.course_fees = course_fees;
            p.faculty_name = faculty_name;
            p.save(function (err) {
                if (err) console.log(err)               
                req.flash('success', 'Course Edited');
                res.redirect('/admin/csvupload');
            })

        });
    }
});

// Get Delete user 

router.get('/delete-csv/:id', isAdmin, function (req, res) {
    var id = req.params.id;
    Courses.findByIdAndDelete(id, function (err) {

    })
        .then(
            req.flash('success', 'User Deleted')
        )
        .catch(err => {
            res.status(500).send({
                error: err
            })
        })
    res.redirect('/admin/csvupload')
});

//Export
module.exports = router;

