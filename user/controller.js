const bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let fs = require('fs');
const { StatusCodes } = require('http-status-codes');
const { validationResult } = require('express-validator');
const { UserService } = require('./service');
let { PRIVATE_KEY } = process.env;

class User {
    //signin
    static signin = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
        }
        let user = await UserService.getActiveUser(req.body.email);
        let isMatch = await bcrypt.compareSync(req.body.password, user.password);
        if (isMatch) {
            let { PRIVATE_KEY } = process.env;
            let token = jwt.sign({ id: user.id, email: user.email }, PRIVATE_KEY, { expiresIn: '1h' });
            return res.status(StatusCodes.OK).json({
                code: StatusCodes.OK,
                data: {
                    token,
                    expiresIn: 3600
                }
            });
        }
        return res.status(StatusCodes.UNAUTHORIZED).json(
            {
                code: StatusCodes.UNAUTHORIZED,
                message: "Email or password is wrong"
            });
    }
    // Create a new user
    static create = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
        }
        let password = bcrypt.hashSync(req.body.password, 5);
        let token = jwt.sign({ email: req.body.email }, PRIVATE_KEY);
        let result = UserService.insert(req.body.name, req.body.email, password, token);
        return res.status(StatusCodes.CREATED).json({ message: result });
    }
    // Update user by :id
    static update = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
        }
        let password = bcrypt.hashSync(req.body.password, 5);
        let result = UserService.update(req.params.id, req.body.name, req.body.email, password);
        return res.status(StatusCodes.OK).json({ message: result });
    }
    //activate profile
    static activateUser = async (req, res) => {
        let token = req.params.authorization;
        if (!token) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Wrong activation link" });
        }
        let email = jwt.verify(token, PRIVATE_KEY).email;
        let user = await UserService.getByEmail(email);
        if (user.hasOwnProperty("id")) {
            if (user.token != token) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: "Token does'nt match to any user" });
            }
            if (user.status == "active") {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: "User is allready active" });
            }
            let activate = UserService.activateUser(email);
            return res.status(StatusCodes.OK).json({ activate });
        }
    }
    //Upload profile pic
    static upload = async (req, res) => {
        if (!req.files) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Please select file to upload" })
        }
        let file = req.files.avatar;
        let extension = file.name.split(".")[1];
        let acceptableExts = ['jpg', 'jpeg', 'png'];
        if (!acceptableExts.includes(extension)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Image format is not acceptable" });
        }
        try {
            if (!fs.existsSync(`images/${req.userId}/`)) {
                fs.mkdirSync(`images/${req.userId}/`);
            }
            file.mv(`images/${req.userId}/` + file.name, (err, result) => {
                if (err) throw err;
                UserService.setAvatar(req.userId, `images/${req.userId}/${file.name}`);
                return res.status(StatusCodes.OK).json({ message: "Success", path: `images/${req.userId}/${file.name}` });
            })
        } catch (e) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Failed to upload file" });
        }

    }
    // Delete user by :id
    static destroy = async (req, res) => {
        let result = await UserService.destroy(req.params.id);
        return res.status(StatusCodes.OK).json({ message: 'Deleted successfully', data: result });
    }
}

module.exports = { User }