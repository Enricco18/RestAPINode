const fs = require('fs');
const { Router } = require('./app/classes/Router');
const config = require('./config');
const dataLib = require('./lib/data');
const helper = require('./lib/helper');

const httpsConfig = {
    key: fs.readFileSync("./https/key.pem"),
    cert: fs.readFileSync("./https/certificate.pem"),
}

const httpsServer = new Router(httpsConfig);
const httpServer = new Router();


httpServer.get("hello", (req, cb) => {
    cb(200, { "message": "Hello World!" })
});

httpServer.post("users", (req, cb) => {
    const firstName = typeof (req.body.firstName) == "string" && req.body.firstName.trim().length > 0 ? req.body.firstName.trim() : false;
    const lastName = typeof (req.body.lastName) == "string" && req.body.lastName.trim().length > 0 ? req.body.lastName.trim() : false;
    const phone = typeof (req.body.phone) == "string" && req.body.phone.trim().length == 10 ? req.body.phone.trim() : false;
    const password = typeof (req.body.password) == "string" && req.body.password.trim().length > 5 ? req.body.password.trim() : false;
    const tosAgreement = typeof (req.body.tosAgreement) == "boolean" && req.body.tosAgreement == true ? true : false;

    if (!(firstName && lastName && phone && password && tosAgreement)) {
        cb(400, { "message": "Missing Fields!" });
        return false;
    }

    dataLib.read('users', phone, (err, data) => {
        if (err) {
            const hashedPassword = helper.hash(password);
            if (!hashedPassword) {
                cb(500, { "message": "Failed to hash password!" })
                return false;
            }

            const userObject = {
                firstName,
                lastName,
                phone,
                password: hashedPassword,
                tosAgreement
            }
            const succededCreation = dataLib.create('users', phone, userObject, (err, data) => {
                if (!err) {
                    cb(200, userObject);
                    return true
                }
                cb(500, { "message": "Failed to create user" });
                return false;
            });

            return succededCreation;
        }
        cb(400, { "message": "User already exists" })
        return false;
    });
});

httpsServer.use(httpServer);

httpServer.listen(config.httpPort, () => {
    console.log(`Server running on port ${config.httpPort} in the ${config.env} enviroment`)
});

httpsServer.listen(config.httpsPort, () => {
    console.log(`Server running on port ${config.httpsPort} in the ${config.env} enviroment`)
});

