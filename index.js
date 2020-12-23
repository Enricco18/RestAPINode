const {Router} = require('./app/classes/Router');

const app = new Router();

app.get("oi",(req,res)=>{
    res.data = {"oi":"oi"}
    return res;
})

app.get("/",(req,res)=>{
    res.httpCode = 201;
    res.data = {"message":"Hello World!"};
    return res;
})
app.listen(3000,()=>{
    console.log("Server running on port 3000")
})
