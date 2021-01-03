const fs = require('fs');
const path = require('path');


const baseDir = path.join(__dirname,"/../","/.data/");

const lib = {};

lib.create= function(dir,filename,data,cb){
    fs.open(`${path.join(baseDir,dir)}/${filename}.json`,"wx",(err,fileDescriptor)=>{
        if(!err && fileDescriptor){
            const dataString = JSON.stringify(data);
            fs.writeFile(fileDescriptor,dataString,(err)=>{
                if(!err){
                    fs.close(fileDescriptor,(err)=>{
                        if(!err){
                            cb(false);
                        }else{
                            cb("Não foi possível fechar o arquivo")
                        }
                    })
                }else{
                    cb("Não foi possível escrever no arquivo")
                }
            })
        }else{
            cb("Não foi possível abrir o arquivo")
        }
    });
}

lib.read = function (dir,filename,cb) {
    fs.readFile(`${path.join(baseDir,dir,"/")}${filename}.json`,"utf8",(err,data)=>{
        cb(err,data);
    })
}

lib.update = function(dir,filename,data,cb){
    fs.open(`${path.join(baseDir,dir)}/${filename}.json`,"r+",(err,fileDescriptor)=>{
        if(!err && fileDescriptor){
            const dataString = JSON.stringify(data);
            fs.ftruncate(fileDescriptor,(err)=>{
                if(!err){
                    fs.writeFile(fileDescriptor,dataString,(err)=>{
                        if(!err){
                            fs.close(fileDescriptor,(err)=>{
                                if(!err){
                                    cb(false);
                                }else{
                                    cb("Não foi possível fechar o arquivo")
                                }
                            })
                        }else{
                            cb("Não foi possível escrever no arquivo")
                        }
                    })
                }else{
                    cb("Não foi possível truncar o arquivo")
                }
            })
           
        }else{
            cb("Não foi possível abrir o arquivo")
        }
    });
}

lib.delete = function (dir,filename,cb) {
    fs.unlink(`${path.join(baseDir,dir,"/")}/${filename}.json`,(err)=>{
        if(!err){
            cb(false);
        }else{
            cb("Erro deletando")
        }
    })
    
}

exports.lib =lib;