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
// http://localhost:3000/api/courses
app.get('/api/courses', (req, res) => {
    res.send(courses);
});

// CREATE RECORD
// http://localhost:3000/api/courses/
app.post('/api/courses', (req, res) => {
    // CUSTOM VALIDATION if Joi & Schema not being used
    // if(!req.body.name || req.body.name.length < 3)
    // {
    //     // 400 Bad Request
    //     res.status(400).send('Name is required and should be minimum 3 characters.');
    //     return;
    // }

    // Validate, id invalid, return 400 - Bad Request
    // const result = validateCourse(req.body);
    const {error} = validateCourse(req.body); // Equivalent to result.error (Object Distructor)
    // if(result.error)
    if(error)
    {
        // res.status(400).send(result.error.details[0].message);
        res.status(400).send(error.details[0].message);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

// SHOW SINGLE RECORD
// http://localhost:3000/api/courses/1
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send('The course with the given ID was not found.');
    res.send(course);
});

// UPDATE RECORD
// http://localhost:3000/api/courses/1
app.put('/api/courses/:id', (req, res) => {
    // Look up the course, if not exists, return 404.
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send('The course with the given ID was not found.');

    // Validate, id invalid, return 400 - Bad Request
    // const result = validateCourse(req.body);
    const {error} = validateCourse(req.body); // Equivalent to result.error (Object Distructor)
    // if(result.error)
    if(error)
    {
        // res.status(400).send(result.error.details[0].message);
        res.status(400).send(error.details[0].message);
        return;
    }

    // Update course, return the updated course
    course.name = req.body.name;
    res.send(course);
});

// DELETE RECORD
// http://localhost:3000/api/courses/1
app.delete('/api/courses/:id', (req, res) => {
    // Look up the course, if not exists, return 404.
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send('The course with the given ID was not found.');

    // Delete course, return the same course 
    const index = courses.indexOf(course)
    courses.splice(index,1);
    res.send(course);
});

function validateCourse(course) {
    const schema = Joi.object ({
        name: Joi.string().min(3).required()
    });
    return schema.validate(course);
}
/* ----------- CRUD OPERATIONS Ends ----------- */


/* ----------- General Routes ----------- */
app.get('/', (req, res) => {
    res.send('Hello World...');
});

app.get('/api/nums', (req, res) => {
    res.send([1,2,3,4,5]);
});

// http://localhost:3000/api/posts/2021/06
app.get('/api/posts/:year/:month', (req, res) => {
    res.send(req.params);
});

// http://localhost:3000/api/customers/?sortBy=name
app.get('/api/customers/', (req, res) => {
    res.send(req.query);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));