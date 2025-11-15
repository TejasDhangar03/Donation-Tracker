import mongoose from "mongoose";
const DonerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    }
});
const Doner = mongoose.model('Doner', DonerSchema);
export default Doner;