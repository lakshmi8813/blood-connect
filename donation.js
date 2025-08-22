const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

// ✅ Enable CORS
app.use(cors());

// ✅ Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ MySQL Database Connection
const db = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'Vin92*Hong',  // Make sure to use environment variables for production
    database: 'bloodconnect'
});


db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL Database');
});

// Create blood_requests table if not exists (optional, but good for dev)
const createRequestTableQuery = `
CREATE TABLE IF NOT EXISTS blood_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullName VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phoneNumber VARCHAR(15) NOT NULL,
  bloodGroup VARCHAR(5) NOT NULL,
  amount INT NOT NULL,
  location VARCHAR(255) NOT NULL,
  urgency ENUM('Low', 'Moderate', 'High', 'Critical') NOT NULL,
  requestDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;
db.query(createRequestTableQuery, (err) => {
    if (err) {
        console.error('Failed to create blood_requests table:', err);
    } else {
        console.log('blood_requests table is ready');
    }
});

// POST /requestBlood – store request & search for matching donors
app.post('/requestBlood', (req, res) => {
    const { fullName, email, phoneNumber, bloodGroup, amount, location, urgency } = req.body;
    const donorQuery = `
    SELECT fullName, email, phoneNumber, bloodGroup, address
    FROM donordetails
    WHERE bloodGroup = ? AND address LIKE ?
        `;
    db.query(donorQuery, [bloodGroup, `%${location}%`], (err, donorResults) => {
        if (err) {
            console.error('Error querying donors:', err);
            return res.status(500).json({ message: 'Failed to find donors' });
        }

        res.json({ message: 'Request saved and donors matched', donors: donorResults });
    });
    // Validate input
    if (!fullName || !email || !phoneNumber || !bloodGroup || !amount || !location || !urgency) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Save the blood request
    const insertRequestQuery = `
        INSERT INTO blood_requests (fullName, email, phoneNumber, bloodGroup, amount, location, urgency)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const requestData = [fullName, email, phoneNumber, bloodGroup, amount, location, urgency];

    db.query(insertRequestQuery, requestData, (err, insertResult) => {
        if (err) {
            console.error('Error saving blood request:', err);
            return res.status(500).json({ message: 'Failed to save request' });
        }

        // Now find matching donors


    });
});



// ✅ Routes
app.get('/', (req, res) => {
    res.send('Blood Connect!');
});

app.post('/donate', (req, res) => {
    let { fullName, age, gender, bloodGroup, email, phoneNumber, lastDonation, address } = req.body;

    // 🔵 Correct gender to 'Male' or 'Female'
    if (gender) {
        gender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
    }
    const sql = `
                INSERT INTO donordetails(fullName, age, gender, bloodGroup, email, phoneNumber, lastDonation, address)
                VALUES( ? , ? , ? , ? , ? , ? , ? , ? )
                `;

    db.query(sql, [fullName, age, gender, bloodGroup, email, phoneNumber, lastDonation, address], (err, result) => {
        if (err) {
            console.error('❌ Error inserting into database:', err.sqlMessage);
            return res.status(500).send('Error: ' + err.sqlMessage);
        }
        res.status(200).send('✅ Thank you for donating blood!');
    });
});

// ✅ Start Server
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`🚀
                Server running at http: //localhost:${PORT}`);
});