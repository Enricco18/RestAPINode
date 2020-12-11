const http = require('http');
const url = require('url');

const app =  http.createServer((req,res)=>{
    //Eu poderia usar só o .end() passando a msg, mas quis deixar mais visível cada função
    res.write("Hello World\n");
    res.end();
});

app.listen(3000,()=>{
    console.log("Server running on port 3000")
})


console.log("hw!");