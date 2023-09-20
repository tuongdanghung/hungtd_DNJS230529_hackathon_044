const express = require("express");

require("dotenv").config();
const initRouters = require("./routers");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initRouters(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
