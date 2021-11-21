const express = require('express');
let fileUpload = require('express-fileupload');
const { connection } = require('./database/connection');
const user = require('./user/route');
const product = require('./product/route');

const app = express();
const {
    HOST,
    PORT,
} = process.env;

app.use(express.json());
app.use(fileUpload());
app.use('/user', user.router);
app.use('/product', product.router)
connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log("Mysql connected succesfully");
});

app.listen(PORT, () => {
    console.log(`started: ${HOST}:${PORT}`)
})