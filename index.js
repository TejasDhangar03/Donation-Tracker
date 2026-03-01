import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import db from './Database/db.js';
import Doner from './Database/DonerSchema.js';

const app = express();

// Fix __dirname in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect DB
db();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, 'Public')));

// Dashboard Route
app.get('/Dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public', 'index.html'));
});


// Data API
app.get('/data', async (req, res) => {
  try {
    const monthly = await Doner.aggregate([
      {
        $addFields: {
          monthNumber: { $substr: ["$date", 5, 2] }
        }
      },
      {
        $group: {
          _id: "$monthNumber",
          totalAmount: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const monthNames = {
      "01": "January", "02": "February", "03": "March",
      "04": "April", "05": "May", "06": "June",
      "07": "July", "08": "August", "09": "September",
      "10": "October", "11": "November", "12": "December"
    };

    const months = monthly.map(m => monthNames[m._id]);
    const data1 = monthly.map(m => m.totalAmount);

    const all = await Doner.find({}, { amount: 1 });
    const totalDoners = all.length;
    const totalAmount = all.reduce((acc, item) => acc + item.amount, 0);

    res.json({
      months,
      data1,
      totalDoners,
      totalAmount
    });

  } catch (err) {
    res.status(500).json({ error: "Error retrieving data" });
  }
});

app.post('/add', async (req, res) => {
  try {
    const { name, amount, date } = req.body;
    console.log(name, amount, date);

    const newDoner = new Doner({
      name,
      amount,
      date
    });

    await newDoner.save();
    res.status(200).json({ status: 200, message: "Data Inserted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, message: "Error Occured" });
  }
});

// added for vercel deployment
export default app;

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});