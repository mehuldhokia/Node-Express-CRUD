const Joi = require('joi');
const express = require('express');
const { required } = require('joi');
const app = express();

app.use(express.json());

/* ----------- CRUD OPERATIONS Starts ----------- */
const courses = [
    { id: 1, name: 'Course1' },
    { id: 2, name: 'Course2' },
    { id: 3, name: 'Course3' },
];

// FETCH ALL RECORDS
app.get('/api/courses', (req, res) => {
    res.send(courses);
});

// CREATE RECORD
app.post('/api/courses', (req, res) => {
    // Validate, id invalid, return 400 - Bad Request
    const {error} = validateCourse(req.body); // Equivalent to result.error (Object Distructor)
    if(error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

// SHOW SINGLE RECORD
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID was not found.');
    res.send(course);
});

// UPDATE RECORD
app.put('/api/courses/:id', (req, res) => {
    // Look up the course, if not exists, return 404.
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID was not found.');

    // Validate, id invalid, return 400 - Bad Request
    const {error} = validateCourse(req.body); // Equivalent to result.error (Object Distructor)
    if(error) return res.status(400).send(error.details[0].message);
    
    // Update course, return the updated course
    course.name = req.body.name;
    res.send(course);
});

// DELETE RECORD
app.delete('/api/courses/:id', (req, res) => {
    // Look up the course, if not exists, return 404.
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID was not found.');

    // Delete course, return the same course 
    const index = courses.indexOf(course)
    courses.splice(index,1);
    res.send(course);
});

// VALIDATION LOGIC
function validateCourse(course) {
    const schema = Joi.object ({
        name: Joi.string().min(3).required()
    });
    return schema.validate(course);
}
/* ----------- CRUD OPERATIONS Ends ----------- */

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));