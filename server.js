const express = require('express')

const app = express();
const cors = require('cors')
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors())

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}


app.listen(PORT , () => console.log(`server running on Port: ${PORT}`))