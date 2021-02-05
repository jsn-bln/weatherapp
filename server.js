const express = require('express')
const cities = require('all-the-cities')
const app = express();
const cors = require('cors')
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors())




app.listen(PORT , () => console.log(`server running on Port: ${PORT}`))