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
app.use(express.static(path.join(__dirname, 'public')));

// Dashboard Route
app.get('/Dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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

// ❌ REMOVE app.listen()
// ✅ Export default for Vercel
export default app;

app.listen(5000, () => { 
  console.log("Server is running on port 5000"); 
});