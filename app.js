const express = require('express');
const mysql = require('mysql');
const credentials = require('./config/mysqlCredentials');

const PORT = 3000;
const app = express();
const connection = mysql.createConnection(credentials);

app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
    res.send('Luigi');
});

app.get('/students', (req, res, next) => {
    let query = 'SELECT * FROM ??';
    let inserts = ['student'];

    let sql = mysql.format(query, inserts);

    connection.query(sql, (err, results, fields) => {
        if (err) return next(err);

        const output = {
            success: true,
            data: results
        }
        res.json(output);
    });
});

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

app.use(function(err, req, res, next){
    if (err) {
        console.error(err);
        res.status(err.status || 500).json("Something broke!");
    }
    next();
})

app.listen(PORT, () => {
    console.log("Server started on PORT: ", PORT);
});