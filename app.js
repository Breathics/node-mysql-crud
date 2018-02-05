// Require needed modules / dependencies
const express = require('express');
const mysql = require('mysql');
const credentials = require('./config/mysqlCredentials');

// Instantiate Express application and MySQL database connection
const app = express();
const PORT = 3000; // PORT used to start your server on
const connection = mysql.createConnection(credentials);

// Verify if connection is successful
connection.connect((err) => {
    if (err) throw err;

    console.log('Connected to database');
});

// === Consumption of middleware === //
// Used to parse data out of the request body
app.use(express.json());
app.use(express.urlencoded());

// === Routes === //
app.get('/', (req, res) => {
    res.send('Luigi');
});

// READ / SELECT all
app.get('/students', (req, res, next) => {
    // Used for prepared statements
    // Store SQL with escaped table/column/value fields
    // Store table/column/value within an array
    let query = 'SELECT * FROM ??';
    let inserts = ['student'];

    // Formats escaped values into valid SQL
    let sql = mysql.format(query, inserts);

    // MySQL query requires an SQL statement and callback to handle database response
    // err if there is any
    // results / rows / data for response
    // fields (if any)
    connection.query(sql, (err, results, fields) => {
        // We use next(err) to pass our err into the next middleware (error-handling)
        if (err) return next(err);

        // Return output response to the client
        const output = {
            success: true,
            data: results
        }
        res.json(output);
    });
});

// READ / SELECT by id
app.get('/students/:id', (req, res, next) => {
    const { id } = req.params;

    let query = 'SELECT * FROM ?? WHERE ?? = ?';
    let inserts = ['students', 'id', id];

    let sql = mysql.format(query, inserts);

    connection.query(sql, (err, results, fields) => {
        if (err) return next(err);

        const output = {
            success: true,
            data: results
        };
        res.json(output);
    });
});

// CREATE / INSERT student
app.post('/students', (req, res, next) => {
    const { name, course, grade } = req.body;

    let query = 'INSERT INTO ?? (??, ??, ??) VALUES (?, ?, ?)';
    let inserts = ['students', 'name', 'course', 'grade', name, course, grade];

    let sql = mysql.format(query, inserts);
    console.log("This is the formatted SQL", sql);
    connection.query(sql, (err, results, fields) => {
        if (err) return next(err);
        const output = {
            success : true,
            data: results
        }
        res.json(output);
    })
});

// UPDATE - Under construction -
app.post('/students/update', (req, res, next) => {
    const { id, name, course, grade } = req.body;

    let query = 'UPDATE ?? SET ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?';
    let inserts = ['students', 'name', name, 'grade', grade, 'course', course, 'id', id];

    let sql = mysql.format(query, inserts);
    console.log("This is the formatted SQL", sql);
    connection.query(sql, (err, results, fields) => {
        if (err) return next(err);
        const output = {
            success : true,
            data: results
        }
        res.json(output);
    })
});

// DELETE
app.post('/students/delete', (req, res, next) => {
    const { id } = req.body;

    let query = 'UPDATE ?? SET ?? = ? WHERE ?? = ?';
    let inserts = ['students', 'status', 'inactive', 'id', id];

    let sql = mysql.format(query, inserts);
    console.log("This is the formatted SQL", sql);
    connection.query(sql, (err, results, fields) => {
        if (err) return next(err);
        const output = {
            success : true,
            data: results
        }
        res.json(output);
    })
});

// === Error Handling Middleware === //
app.use(function(err, req, res, next){
    if (err) {
        console.error(err);
        res.status(err.status || 500).json("Something broke!");
    }
    next();
})

// === Listening on PORT === //
app.listen(PORT, () => {
    console.log("Server started on PORT: ", PORT);
});