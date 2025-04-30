const express = require('express');
const app = express();
const dashboardRoutes = require('./routes/dashboardRoutes');
const bddyParser = require('body-parser');
const cors = require('cors');
const PORT = 3000

app.use(express.json());
app.use(bddyParser.json());
app.use(bddyParser.json());
app.use(cors());
app.use('/api', dashboardRoutes);

app.listen(PORT, ()=>{
    console.log("Server is listening At::", PORT)
})
