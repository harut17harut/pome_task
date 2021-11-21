let fs = require('fs');
const { StatusCodes } = require('http-status-codes');
const { ProductService } = require('./service');
const { validationResult } = require('express-validator');
const { json } = require('express');

class Product {
    static index = async (req, res) => {
        let result = await ProductService.getAll();
        return res.status(StatusCodes.OK).json({ message: 'success', data: result });
    }
    static show = async (req, res) => {
        let result = await ProductService.getById(req.params.productId);
        return res.status(StatusCodes.OK).json({ message: 'success', data: result });
    }
    static create = (req, res) => {
        try {
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: errors.array() });
            }
            let { title, price } = req.body;
            let user_id = req.body.userId;
            let result = ProductService.insert(user_id, title, price);
            return res.status(StatusCodes.CREATED).json({ message: result });
        }
        catch (error) {
            throw error;
        }
    }

    static update = (req, res) => {
        try {
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: errors.array() });
            }
            let { productId } = req.params;
            let { title, price } = req.body;
            let result = ProductService.update(productId, title, price);
            res.status(StatusCodes.OK).json({ message: result });
        }
        catch (error) {
            throw error;
        }
    }

    static upload = async (req, res) => {
        if (!req.files) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Please select files to upload" })
        }
        try {
            let files = req.files.photo;
            let filesArray = [];
            let errors = "";
            for (const file of files) {

                let extension = file.name.split(".")[1];
                let acceptableExts = ['jpg', 'jpeg', 'png'];
                if (!acceptableExts.includes(extension)) {
                    errors += "Image format is not acceptable";
                    return
                }
                if (!fs.existsSync(`productimages/${req.params.productId}/`)) {
                    fs.mkdirSync(`productimages/${req.params.productId}/`);
                }
                file.mv(`productimages/${req.params.productId}/` + file.name, (err, result) => {
                    if (err) throw err;


                });
                filesArray.push(`productimages/${req.params.productId}/${file.name}`);

            }
            if (errors) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: "" });
            }
            let mainPhoto = filesArray[0];
            filesArray.shift();
            let Photos = {
                main: mainPhoto,
                other: filesArray
            }
            ProductService.setPhotos(req.params.productId, Photos);
            return res.status(StatusCodes.OK).json({ message: "Success", path: Photos });

        } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Failed to upload file", error: err });
        }
    }
    static destroy = (req, res) => {
        try {
            let { productId } = req.params;
            let result = ProductService.destroy(productId);
            return res.status(StatusCodes.OK).json({ message: result });
        }
        catch (error) {
            throw error;
        }
    }
}
module.exports = { Product }