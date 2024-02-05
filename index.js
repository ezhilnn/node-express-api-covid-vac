const express = require("express");
const mysql = require("mysql");
const app = express();
const cors = require("cors"); 
const path = require('path'); // Import the path module
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
const con=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'ezhila47',
    database:'covid1'
})
app.use(express.urlencoded({ extended: true }));

con.connect((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("connected to a database");
    }
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/vac', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','vac.html'));
});
app.post("/sign-up",(req,res)=>{
    const aadhar_number = req.body.aadhar_number.toString();
    const name = req.body.name.toString();
    const age = req.body.age.toString();
    const mobile = req.body.mobile.toString();
    const password = req.body.password.toString();

    con.query('INSERT INTO users (aadhar_number, name, age, mobile, password) VALUES (?, ?, ?, ?, ?)', 
        [aadhar_number, name, age, mobile, password], 
        (err, result) => {
            if(err) {
                console.error(err);
                res.status(500).send('Error signing up');
            } else {
                console.log("User signed up successfully");
                res.send("User signed up successfully");
            }
        }
    );
});

// app.post("/sign-up",(req,res)=>{
//     const mobile = req.body.mobile;
//     const password = req.body.password;
    
//     // Execute the SQL query to insert data into the 'users' table
//     con.query('INSERT INTO users (mobile, password) VALUES (?, ?)', [mobile, password], (err, result) => {
//         if(err){
//             console.log(err);
//             res.status(500).send("Error occurred while inserting data");
//         } else {
//             console.log("Data inserted successfully");
//             res.status(200).send("Data inserted successfully");
//         }
//     });
// });
app.post("/submit-vaccination", (req, res) => {
    const mobileNumber = req.body.mobile_number;
    const vaccinationDate = req.body.vaccination_date;

    // Insert vaccination details into the 'vaccination' table
    con.query('INSERT INTO vaccination (mobile_number, vaccination_date) VALUES (?, ?)', [mobileNumber, vaccinationDate], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error occurred while inserting vaccination details");
        } else {
            console.log("Vaccination details inserted successfully");
            res.status(200).json({ message: "Vaccination details inserted successfully" });

        }
    });
});

app.get('/centers', (req, res) => {
    const query = 'SELECT * FROM center';

    // Execute the query
    con.query(query, (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        // Send the results as JSON
        res.json(results);
    });
});



// Assuming con is your MySQL connection variable

app.post("/add-center", (req, res) => {
    const name = req.body.name;
    const location = req.body.location;
    const total_slots = req.body.total_slots;
    const available_slots = req.body.available_slots;

    const sql = 'INSERT INTO center (name, location, total_slots, available_slots) VALUES (?, ?, ?, ?)';
    con.query(sql, [name, location, total_slots, available_slots], (err, result) => {
        if (err) {
            console.error('Error inserting center: ' + err.stack);
            res.status(500).send('Error inserting center');
            return;
        }
        console.log('Center added successfully');
        res.send('Center added successfully');
    });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
