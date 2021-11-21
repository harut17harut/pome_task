const { connection } = require('../database/connection');

class UserService {
    //get user by email
    static getByEmail = async (email) => {
        let userData = new Promise((resolve, reject) => {
            connection.query('SELECT * FROM users WHERE email = ?', [email], function (error, results, fields) {
                if (error) return reject(error);
                resolve(results)
            });
        });
        let result = await userData;
        return result[0];
    }
    //get active user
    static getActiveUser = async (email) => {
        let userData = new Promise((resolve, reject) => {
            try {
                connection.query("SELECT * FROM users WHERE email = ? AND `status`= 'active' ", [email], function (error, results, fields) {
                    if (error) return reject(error);
                    resolve(results)
                });
            }
            catch (error) {
                throw error;
            }
        });
        let result = await userData;
        return result[0];
    }
    //get all users 
    static getAll = async () => {
        let userData = new Promise((resolve, reject) => {
            connection.query('select  id,name,dob,created_at,updated_at from `users`', function (error, results, fields) {
                if (error) return reject(error);
                resolve(results)
            });
        });
        let result = await userData;
        return result;
    }
    // get by id 
    static getByid = async (id) => {
        let userData = new Promise((resolve, reject) => {
            connection.query('select id,name,dob,created_at,updated_at from `users` where id=?', [id], function (error, results, fields) {
                if (error) return reject(error);
                resolve(results)
            });
        });
        let result = await userData;
        return result;
    }
    //service insert user 
    static insert = (name, email, password, token) => {
        connection.query('INSERT INTO `users` (`name`,`email`,`password`,`token`) VALUES (?,?,?,?)', [name, email, password, token], function (error, results, fields) {
            if (error) throw error;
        });
        return "success";
    }
    //service update user
    static update = (id, name, email, password) => {
        connection.query(`UPDATE users SET name='${name}',email='${email}',password='${password}' WHERE id='${id}'`, function (error, results, fields) {
            if (error) throw error;
        });
        return "Update success";
    }
    static setAvatar = (id, path) => {
        connection.query(`UPDATE users SET avatarpath='${path}' WHERE id='${id}'`, function (error, results, fields) {
            if (error) throw error;
        });
    }
    static activateUser = (email) => {
        connection.query(`UPDATE users SET status='active' WHERE email='${email}'`, function (error, results, fields) {
            if (error) throw error;
        });
        return "Activation sucess";
    }
    //service delete user
    static destroy = async (id) => {
        let userData = new Promise((resolve, reject) => {
            connection.query('DELETE  FROM `users` WHERE id=?', [id], function (error, results, fields) {
                if (error) return reject(error);
                resolve(results)
            });
        });
        let result = await userData;
        return result;
    }

}

module.exports = { UserService };