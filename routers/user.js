const router = require("express").Router();
const fs = require("fs");
router.get("/", (req, res) => {
    const readGetUser = fs.readFileSync("./users.json", "utf8");
    const jsonDataUser = JSON.parse(readGetUser);
    res.status(200).send({
        success: jsonDataUser ? true : false,
        data: jsonDataUser ? jsonDataUser : false,
    });
});

router.post("/", (req, res) => {
    const readGetUser = fs.readFileSync("./users.json", "utf8");
    const jsonDataUser = JSON.parse(readGetUser);
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

router.get("/:id", (req, res) => {
    const readGetUser = fs.readFileSync("./users.json", "utf8");
    const jsonDataUser = JSON.parse(readGetUser);
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

router.put("/:id", (req, res) => {
    const readGetUser = fs.readFileSync("./users.json", "utf8");
    const jsonDataUser = JSON.parse(readGetUser);
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

router.delete("/:id", (req, res) => {
    const readGetUser = fs.readFileSync("./users.json", "utf8");
    const jsonDataUser = JSON.parse(readGetUser);
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

module.exports = router;
