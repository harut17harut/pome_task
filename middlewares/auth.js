const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
let { UserService } = require('../user/service');
module.exports.auth = async (req, res, next) => {
    const { authorization, accept } = req.headers;
    let errorMessage = [];
    if (!authorization) {
        errorMessage.push("header authorization is missing");
    }
    if (authorization && !authorization.includes("Bearer ")) {
        errorMessage.push("Token key must contain bearer");
    }
    if (!accept) {
        errorMessage.push("Header accept is missing");
    }
    if (accept != 'application/json') {
        errorMessage.push("header accepts only application/json");
    }
    if (errorMessage.length) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: errorMessage });
    }
    let bearerToken = authorization.split(' ')[1];
    if (bearerToken) {

        try {
            let { PRIVATE_KEY } = process.env;
            let data = jwt.verify(bearerToken, PRIVATE_KEY);
            if (data && data.hasOwnProperty('email')) {
                let DBUser = await UserService.getByEmail(data.email);

                if (!DBUser.hasOwnProperty("id")) {
                    return res.status(StatusCodes.BAD_REQUEST).json({ message: "A User of given token not found" });
                }
                req.body.userId = data.id;
                req.body.email = data.email;
                return next();
            }
        }
        catch (error) { }
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({ code: StatusCodes.UNAUTHORIZED, message: "UNAUTHORIZED" });
};
module.exports.isAdmin = async (req, res, next) => {
    let user = await UserService.getActiveUser(req.body.email);
    if (user.role_id != "1") {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({ message: "Only admin have access to this action" })
    }
    return next();
}