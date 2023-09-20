const express = require("express");
const fs = require("fs");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const readGetUser = fs.readFileSync("./users.json", "utf8");
const jsonDataUser = JSON.parse(readGetUser);
const readGetPosts = fs.readFileSync("./posts.json", "utf8");
const jsonDataPosts = JSON.parse(readGetPosts);

app.post("/api/v1/users", (req, res) => {
    const newValue = req.body;
    const isCheckEmail = jsonDataUser.find(
        (item) => item.email === newValue.email
    );
    if (isCheckEmail) {
        return res.status(409).send({
            success: false,
            message: "Email đã bị trùng lặp",
        });
    }
    const maxId = jsonDataUser.reduce(
        (max, user) => (user.id > max ? user.id : max + 1),
        1
    );
    const newData = [...jsonDataUser, { ...newValue, id: maxId }];
    fs.writeFileSync("./users.json", JSON.stringify(newData));
    res.status(200).send({
        success: jsonDataUser ? true : false,
        message: "create successfully",
    });
});

app.get("/api/v1/users", (req, res) => {
    res.status(200).send({
        success: jsonDataUser ? true : false,
        data: jsonDataUser ? jsonDataUser : false,
    });
});

app.get("/api/v1/user/:id", (req, res) => {
    const { id } = req.params;
    const response = jsonDataUser.find((item) => item.id === +id);
    if (!response) {
        return res.status(504).send({
            success: false,
            message: "Không tìm thấy user",
        });
    }
    return res.status(200).send({
        success: response ? true : false,
        data: response ? response : false,
    });
});

app.delete("/api/v1/user/:id", (req, res) => {
    const { id } = req.params;
    const response = jsonDataUser.filter((item) => item.id !== +id);
    if (!response) {
        return res.status(504).send({
            success: false,
            message: "delete failed",
        });
    }
    fs.writeFileSync("./users.json", JSON.stringify(response));
    return res.status(200).send({
        success: response ? true : false,
        message: "delete successfully",
    });
});

app.put("/api/v1/user/:id", (req, res) => {
    const { id } = req.params;
    const updatedUserData = req.body;
    const userIndex = jsonDataUser.findIndex((item) => item.id === +id);
    console.log(userIndex);
    if (userIndex === -1) {
        res.status(504).send({
            success: false,
            message: "Người dùng không tồn tại.",
        });
    } else {
        jsonDataUser[userIndex] = {
            ...jsonDataUser[userIndex],
            ...updatedUserData,
        };
        fs.writeFileSync("./users.json", JSON.stringify(jsonDataUser));
        res.status(200).send({
            success: jsonDataUser ? true : false,
            message: "updated successfully",
        });
    }
});

// end user

app.post("/api/v1/posts", (req, res) => {
    const newValue = req.body;
    const isCheckTitle = jsonDataPosts.find(
        (item) => item.title === newValue.title
    );
    if (isCheckTitle) {
        return res.status(409).send({
            success: false,
            message: "Title đã bị trùng lặp",
        });
    }
    const maxId = jsonDataPosts.reduce(
        (max, user) => (user.id > max ? user.id : max + 1),
        1
    );
    const newData = [...jsonDataPosts, { ...newValue, id: maxId }];
    fs.writeFileSync("./posts.json", JSON.stringify(newData));
    res.status(200).send({
        success: jsonDataPosts ? true : false,
        message: "create successfully",
    });
});

app.get("/api/v1/posts", (req, res) => {
    res.status(200).send({
        success: jsonDataPosts ? true : false,
        data: jsonDataPosts ? jsonDataPosts : false,
    });
});

app.get("/api/v1/post/:id", (req, res) => {
    const { id } = req.params;
    const response = jsonDataPosts.find((item) => item.id === +id);
    if (!response) {
        return res.status(504).send({
            success: false,
            message: "Không tìm thấy post",
        });
    }
    return res.status(200).send({
        success: response ? true : false,
        data: response ? response : false,
    });
});

app.delete("/api/v1/post/:id", (req, res) => {
    const { id } = req.params;
    const response = jsonDataPosts.filter((item) => item.id !== +id);
    console.log(response);
    if (!response) {
        return res.status(504).send({
            success: false,
            message: "delete failed",
        });
    }
    fs.writeFileSync("./posts.json", JSON.stringify(response));
    return res.status(200).send({
        success: response ? true : false,
        message: "delete successfully",
    });
});

app.put("/api/v1/post/:id", (req, res) => {
    const { id } = req.params;
    const updatedPostData = req.body;
    const userIndex = jsonDataPosts.findIndex((item) => item.id === +id);
    if (userIndex === -1) {
        res.status(504).send({
            success: false,
            message: "Người dùng không tồn tại.",
        });
    } else {
        jsonDataPosts[userIndex] = {
            ...jsonDataPosts[userIndex],
            ...updatedPostData,
        };
        fs.writeFileSync("./posts.json", JSON.stringify(jsonDataPosts));
        res.status(200).send({
            success: jsonDataPosts ? true : false,
            message: "updated successfully",
        });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
