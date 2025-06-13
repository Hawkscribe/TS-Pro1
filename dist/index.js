"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const db_1 = require("./db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// const userSchema=z.object({
//     name:z.string().min(3).max(10),
//     password:z.string().regex(
//         /^(?=.*[a-z])(?=.*[A-Z]).*$/,
//         'Must contain at least one lowercase and one uppercase letter.'
//       ),
// });
app.use((0, cors_1.default)());
const middleware_1 = require("./middleware");
app.post("/api/signup", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, password } = req.body;
        if (!name || !password) {
            res.status(411).json({ msg: "Inputs required" });
            return;
        }
        try {
            const newUser = yield db_1.UserModel.create({
                username: name,
                password: password,
            });
            res.status(200).json({ msg: `Created user with name ${newUser.username}` });
            return;
        }
        catch (error) {
            res.status(500).json({ msg: "User already exists or DB error" });
            return;
        }
    });
});
app.post("/api/signin", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, password } = req.body;
        if (!name || !password) {
            res.status(401).json({ msg: "Enter the name and password both" });
            return;
        }
        try {
            const user = yield db_1.UserModel.findOne({
                username: name,
            });
            if (!user || user.password !== password) {
                res.status(401).json({ msg: "NOt found" });
                return;
            }
            const token = jsonwebtoken_1.default.sign({ userId: user._id, name: user.username }, config_1.JWT_PASSWORD);
            res.status(201).json({ token });
        }
        catch (error) {
            res.status(500).json("User is not found");
            return;
        }
    });
});
app.post("/api/content", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const link = req.body.link;
    const type = req.body.type;
    yield db_1.ContentModel.create({
        link,
        type,
        //@ts-ignore
        userId: req.userId,
        tags: []
    });
    res.status(200).json({ msg: "the comment is beign created sucessfully" });
    return;
}));
app.get("/api/content", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    const content = yield db_1.ContentModel.find({
        userId: userId
    }).populate("userId", "username");
    res.json({
        content
    });
    return;
}));
app.delete("/api/content", (req, res) => {
});
app.post("/api/brain/share", (req, res) => {
});
app.get("/api/brain /:shareLink", (req, res) => {
});
app.listen(8000);
