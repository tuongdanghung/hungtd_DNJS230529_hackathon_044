const user = require("./user");
const posts = require("./posts");

module.exports = (app) => {
    app.use("/api/v1/users", user);
    app.use("/api/v1/posts", posts);
};
