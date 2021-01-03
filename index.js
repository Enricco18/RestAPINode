const fs = require('fs');
const {Router} = require('./app/classes/Router');
const config = require('./config');
const data = require('./lib/data').lib;

const httpsConfig = {
    key: fs.readFileSync("./https/key.pem"),
    cert: fs.readFileSync("./https/certificate.pem"),
}

const httpsServer = new Router(httpsConfig);
const httpServer = new Router();

data.delete("teste","fileName",(err)=>{
    console.log(err);
})

httpServer.get("hello",(req,res)=>{
    res.httpCode = 200;
    res.data = {"message":"Hello World!"};
    return res;
});

httpsServer.use(httpServer);

httpServer.listen(config.httpPort,()=>{
    console.log(`Server running on port ${config.httpPort} in the ${config.env} enviroment`)
});

httpsServer.listen(config.httpsPort,()=>{
    console.log(`Server running on port ${config.httpsPort} in the ${config.env} enviroment`)
});

