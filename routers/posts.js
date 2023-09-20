const router = require("express").Router();
const fs = require("fs");
router.get("/", (req, res) => {
    const readGetPosts = fs.readFileSync("./posts.json", "utf8");
    const jsonDataPosts = JSON.parse(readGetPosts);
    res.status(200).send({
        success: jsonDataPosts ? true : false,
        data: jsonDataPosts ? jsonDataPosts : false,
    });
});

router.post("/", (req, res) => {
    const readGetPosts = fs.readFileSync("./posts.json", "utf8");
    const jsonDataPosts = JSON.parse(readGetPosts);
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

router.get("/:id", (req, res) => {
    const readGetPosts = fs.readFileSync("./posts.json", "utf8");
    const jsonDataPosts = JSON.parse(readGetPosts);
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

router.put("/:id", (req, res) => {
    const readGetPosts = fs.readFileSync("./posts.json", "utf8");
    const jsonDataPosts = JSON.parse(readGetPosts);
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

router.delete("/:id", (req, res) => {
    const readGetPosts = fs.readFileSync("./posts.json", "utf8");
    const jsonDataPosts = JSON.parse(readGetPosts);
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

module.exports = router;
