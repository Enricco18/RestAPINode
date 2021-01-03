const http = require('http');
const https = require('https');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder("utf-8");


class Router{
    constructor(credentials){
        this._unfiedSrv = this._unfiedSrv.bind(this);

        this.server = typeof(credentials) ==="undefined"?http.createServer(this._unfiedSrv):https.createServer(credentials,this._unfiedSrv);
        this.routes = {
            default:(req,res)=> {
                                res.httpCode= 404
                                res.data = {"message": "Not Found!"}
                                return res
                                }
        };
    }

    _unfiedSrv(req,res){

        const parsedUrl = url.parse(req.url,true);
        let buffer = '';
    
        const reqData = {
            // O Regex abaixo tira as "/" do início (^) e final($), em toda a cadeia de caractéres(g)
            path: parsedUrl.pathname.replace(/^\/+|\/+$/g,''),
            method: req.method.trim().toUpperCase(),
            query: parsedUrl.query,
            headers: req.headers
        };
    
        req.on("data",(data)=>{
            buffer += decoder.write(data);
        });
    
        req.on("end",()=>{
            const resData ={
                httpCode: 200,
                data: {}
            };

            buffer += decoder.end();
            reqData.body = buffer;

            let  choosenHandler = this.routes["default"];

            if(typeof(this.routes[reqData.path]) !== "undefined")
                choosenHandler = this.routes[reqData.path][reqData.method]? this.routes[reqData.path][reqData.method]:this.routes["default"];
                
            const handlerResponse = choosenHandler(reqData, resData);
    
            handlerResponse.data = typeof(handlerResponse.data) == "object"? JSON.stringify(handlerResponse.data): handlerResponse.data;
    
            res.setHeader("Content-Type","application/json")
            //Eu poderia usar só o .end() passando a msg, mas quis deixar mais visível cada função
            res.writeHead(handlerResponse.httpCode);
            res.write(handlerResponse.data)
            res.end();
        });
    }

    listen(port, cb){
        this.server.listen(port,cb);
    }

    use(server){
        this.routes = server.routes;
    }

    _createPath(path){
        path = path.replace(/^\/+|\/+$/g,'');
        this.routes[path] = typeof(this.routes[path]) =="undefined"? {} : this.routes[path];
        return path;
    }
    get(path,cb){
        path = this._createPath(path);
        this.routes[path]["GET"] = cb;
    }

    post(path,cb){
        path = this._createPath(path);
        this.routes[path]["POST"] = cb;
    }

    put(path,cb){
        path = this._createPath(path);
        this.routes[path]["PUT"] = cb;
    }

    delete(path,cb){
        path = this._createPath(path);
        this.routes[path]["DELETE"] = cb;
    }
}

module.exports =  {Router:Router};