const express = require("express");
require("dotenv").config();
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: ["http://127.0.0.1:5173"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

const port = process.env.PORT || 5000;

app.post("/api/game/create", (req, res) => {
    const readGetForm = fs.readFileSync("./player.json", "utf8");
    const jsonData = JSON.parse(readGetForm);
    const newNames = req.body;
    const maxId = jsonData[0].game.reduce(
        (max, game) => (game.id > max ? game.id : max + 1),
        1
    );
    const newPlayers = [];
    for (const key in newNames) {
        newPlayers.push({
            idPlayer: newPlayers.length + 1,
            name: newNames[key],
            row: [{ idRow: 0, points: 0 }],
        });
    }
    jsonData[0].game.push({
        id: maxId,
        player: newPlayers,
    });
    fs.writeFileSync("./player.json", JSON.stringify(jsonData));
    res.status(200).send({
        success: jsonData ? true : false,
        message: "create successfully",
        count: maxId,
    });
});

app.get("/api/game", (req, res) => {
    const readGetForm = fs.readFileSync("./player.json", "utf8");
    const jsonData = JSON.parse(readGetForm);
    res.status(200).send({
        success: jsonData ? true : false,
        data: jsonData ? jsonData : false,
    });
});

app.get("/api/game/:id", (req, res) => {
    const readGetForm = fs.readFileSync("./player.json", "utf8");
    const jsonData = JSON.parse(readGetForm);
    const { id } = req.params;
    const response = jsonData[0].game.find((gameItem) => gameItem.id === +id);
    if (!response) {
        return res.status(504).send({
            success: false,
            message: "Missing input",
        });
    }
    return res.status(200).send({
        success: response ? true : false,
        data: response ? response : false,
    });
});

app.put("/api/game/:gameId/players/:playerId/rows/:rowId", (req, res) => {
    const readGetForm = fs.readFileSync("./player.json", "utf8");
    const jsonData = JSON.parse(readGetForm);
    const gameId = req.params.gameId;
    const playerId = req.params.playerId;
    const rowId = req.params.rowId;
    const newPoints = req.body.points; // Lấy điểm mới từ body của yêu cầu PUT
    // Tìm trò chơi cụ thể theo gameId
    const game = jsonData[0].game.find((game) => game.id === parseInt(gameId));

    if (!game) {
        return res
            .status(404)
            .json({ success: false, message: "Không tìm thấy trò chơi." });
    }

    // // Tìm người chơi cụ thể trong trò chơi
    const player = game.player.find(
        (player) => player.idPlayer === parseInt(playerId)
    );
    if (!player) {
        return res
            .status(404)
            .json({ success: false, message: "Không tìm thấy người chơi." });
    }

    const row = player.row.find((row) => row.idRow === parseInt(rowId));

    if (!row) {
        return res
            .status(404)
            .json({ success: false, message: "Không tìm thấy hàng." });
    }
    row.points = +row.points + +newPoints;

    fs.writeFileSync("./player.json", JSON.stringify(jsonData));

    res.status(200).json({
        success: true,
        message: "Cập nhật điểm thành công.",
    });
});

app.put("/api/game/:id", (req, res) => {
    const readGetForm = fs.readFileSync("./player.json", "utf8");
    const jsonData = JSON.parse(readGetForm);
    const gameId = req.params.id;
    const newRows = req.body.newRows;
    const gameToUpdate = jsonData[0].game.find(
        (game) => game.id === parseInt(gameId)
    );
    if (!gameToUpdate) {
        return res
            .status(404)
            .json({ success: false, message: "Trò chơi không tồn tại." });
    }
    gameToUpdate.player.forEach((player, index) => {
        const newRow = {
            idRow: player.row.length,
            points: 0,
        };
        player.row.push(newRow);
    });
    fs.writeFileSync("./player.json", JSON.stringify(jsonData));

    res.status(200).json({
        success: true,
        message: "Tạo hàng mới thành công.",
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
