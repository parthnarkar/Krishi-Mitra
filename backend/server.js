const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get('/' , (req , res) => {
    res.send('API is running...');
});

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected...')).catch((err) => console.log(err));

//Server Configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT , () => console.log(`Server running on port ${PORT}`));