const { connection } = require('../database/connection');

class ProductService {
    static getAll = async () => {
        let productData = new Promise((resolve, reject) => {
            connection.query('SELECT * FROM `products`', function (error, results, fields) {
                if (error) return reject(error);
                resolve(results)
            });
        });
        let result = await productData;
        return result;
    }
    static getById = async (id) => {
        let productData = new Promise((resolve, reject) => {
            connection.query('SELECT * FROM `products` WHERE id = ?', [id], function (error, results, fields) {
                if (error) return reject(error);
                resolve(results)
            });
        });
        let result = await productData;
        return result;
    }
    static insert = (user_id, title, price) => {
        connection.query(`INSERT INTO products (user_id,title,price) VALUES ('${user_id}','${title}','${price}')`, (error, data) => {
            if (error) throw error;
        });
        return "Product added successfully";
    }
    static update = (id, title, price) => {
        connection.query(`UPDATE products SET title='${title}',price='${price}' WHERE id=${id}`, (error, data) => {
            if (error) throw error;
        });
        return "updated sucessfully";
    }

    static setPhotos = (id, files) => {
        connection.query(`UPDATE products SET product_images=? WHERE id='${id}'`, [JSON.stringify(files)], function (error, results, fields) {
            if (error) throw error;
        });
    }

    static destroy = (id) => {
        connection.query(`DELETE FROM products WHERE id=${id}`, (error, data) => {
            if (error) throw error;

        });
        return "deleted sucesfully";
    }

}
module.exports = { ProductService }