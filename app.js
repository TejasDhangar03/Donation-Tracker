import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

import db from './Database/db.js';
import Doner from './Database/DonerSchema.js';

const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

db();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "/public/HTML/index.html"));

});

app.get('/data', async (req, res) => {
  try {
    // 1️⃣ Group by month (from string date) and sum amounts
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


    // month no to  month name
    const monthNames = {
      "01": "January", "02": "February", "03": "March",
      "04": "April", "05": "May", "06": "June",
      "07": "July", "08": "August", "09": "September",
      "10": "October", "11": "November", "12": "December"
    };

    const months = monthly.map(m => monthNames[m._id]);
    const data1 = monthly.map(m => m.totalAmount);


    // collecting total no of doners and total amount
    const all = await Doner.find({}, { amount: 1 });
    const totalDoners = all.length;
    const totalAmount = all.reduce((acc, item) => acc + item.amount, 0);

    // sending response
    res.json({
      months,
      data1,
      totalDoners,
      totalAmount
    });

  } catch (err) {
    res.status(500).send("Error retrieving data");
  }

});

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// for vercel serverless deployment
export default app;