var express = require('express');
var ejs = require('ejs');
var path = require('path');
var fs = require('fs');
var mysql = require('mysql');
var Multer = require('multer');
var app = express();
var ueditor = require("ueditor");
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
// view engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function (req, res, next) {
    //客户端上传文件设置
    var imgDir = '/img/ueditor/'
     var ActionType = req.query.action;
    if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
        var file_url = imgDir;//默认图片上传地址
        /*其他上传格式的地址*/
        if (ActionType === 'uploadfile') {
            file_url = '/file/ueditor/'; //附件
        }
        if (ActionType === 'uploadvideo') {
            file_url = '/video/ueditor/'; //视频
        }
        res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = imgDir;
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        // console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/ueditor/nodejs/config.json');
    }
}));


app.use('/info.html', function (req, res) {
    res.render('ueditor');
});

app.listen(9889);



app.use(Multer({dest:'./img/'}).any());



app.use('/sign.html', function(req, res) {
    fs.readFile('views/sign.html','utf8',(err,data)=>{
        res.send(data);
    });
});

//注册
app.use('/register',(req,res)=>{
    console.log(req.query)
    var Pool = mysql.createPool({'host':'localhost','user':'root','password':'123456','database':'aa'});
    Pool.getConnection((err,c)=>{
        if(err){console.log(err)}
        else{
            c.query('SELECT name FROM `three` WHERE name="'+req.query.name+'";',(err,data)=>{
                if(err){
                    res.send({ok:0,msg:'数据连接失败'});
                    console.log(err);
                    c.end();
                }
                else{
                    if(data.length>0){
                        res.send({ok:0,msg:'用户已存在'});
                        c.end();
                    }
                    else{
                        c.query("INSERT INTO `three` (`name`,`pass`,`email`) VALUES('"+req.query.name+"','"+req.query.pass+"','"+req.query.email+"');",(err,data)=>{
                            if(err){
                               console.log(err)
                            }
                            else{
                                res.send({ok:1,msg:'注册成功'});
                            }
                            c.end();
                        }); 
                    }
                }
            })
        }
    });
});

//登录
app.use('/login',(req,res)=>{
    console.log(req.query)
    var Pool = mysql.createPool({'host':'localhost','user':'root','password':'123456','database':'aa'});
    Pool.getConnection((err,c)=>{
        if(err){console.log(err)}
        else{
            c.query('SELECT name,pass,ID FROM `three` WHERE name="'+req.query.name+'" AND pass="'+req.query.pass+'";',(err,data)=>{
                if(err){
                    res.send({ok:0,msg:'数据连接失败'});
                    console.log(err);
                    c.end();
                }
                else{
                    if(data.length>0){
                        res.cookie("user",data[0].ID,{maxAge:1000*60*10})
                        res.send({ok:1,msg:'登录成功',data:data});
                    }
                    else{
                        res.send({ok:0,msg:'账号或密码错误'});
                    };
                    c.end();
                }
            })
        }
    })
});

//发布信息
app.use('/release',(req,res)=>{
    console.log(req.body);
    console.log(req.files)
    var newName =req.files[0].path + path.parse(req.files[0].originalname).ext;
    var aa=req.files[0].filename + path.parse(req.files[0].originalname).ext;
    fs.rename(req.files[0].path,newName,(err)=>{
        if(err){
            console.log(err);
        }
    })
    var Pool = mysql.createPool({'host':'localhost','user':'root','password':'123456','database':'aa'});
    Pool.getConnection((err,c)=>{
        if(err){console.log(err)}
        else{
            c.query('SELECT title FROM `one` WHERE title="'+req.body.title+'";',(err,data)=>{
                if(err){
                    res.send({ok:0,msg:'数据连接失败'});
                    console.log(err);
                    c.end();
                }
                else{
                    if(data.length>0){
                        res.send({ok:0,msg:'文章已存在'});
                        c.end();
                    }
                    else{
                        c.query("INSERT INTO `one` (`title`,`file`,`content`,`introduce`,`user`) VALUES('"+req.body.title+"','"+aa+"','"+req.body.content+"','"+req.body.introduce+"','"+req.body.user+"');",(err,data)=>{
                            if(err){
                               console.log(err)
                            }
                            else{
                                res.send({ok:1,msg:'发布成功'});
                            }
                            c.end();
                        }); 
                    }
                }
            })
        }
    });
});

//修改首页信息
app.use('/modify',(req,res)=>{
    console.log(req.body);
    console.log(req.files)
    var newName =req.files[0].path + path.parse(req.files[0].originalname).ext;
    var aa=req.files[0].filename + path.parse(req.files[0].originalname).ext;
    fs.rename(req.files[0].path,newName,(err)=>{
        if(err){
            console.log(err);
        }
    })
    var Pool = mysql.createPool({'host':'localhost','user':'root','password':'123456','database':'aa'});
    Pool.getConnection((err,c)=>{
        if(err){console.log(err)}
        else{
            c.query('SELECT title FROM `two`;',(err,data)=>{
                if(err){
                    res.send({ok:0,msg:'数据连接失败'});
                    console.log(err);
                    c.end();
                }
                else{
                    var time=new Date().toLocaleTimeString();
                    c.query("UPDATE `two` SET title='"+req.body.title+"',content='"+req.body.content+"',file='"+aa+"',time='"+time+"',user='"+2+"' WHERE ID='"+1+"';",(err,data)=>{
                        if(err){
                           console.log(err)
                        }
                        else{
                            res.send({ok:1,msg:'修改成功'});
                        }
                        c.end();
                    }); 
                }
            })
        }
    });
});
app.use("/motion",(req,res)=>{
    var Pool = mysql.createPool({'host':'localhost','user':'root','password':'123456','database':'aa'});
    Pool.getConnection((err,connection)=>{
        if(err){
            console.log(err)
        }else{
            connection.query("SELECT name FROM `three` WHERE ID='"+req.query.userId+"';",(err,datas)=>{
                if(err){
                    console.log(err)
                }else{
                    if(datas.length>0){
                        connection.query("SELECT * FROM `one`;",(err,datab)=>{
                            if(err){
                                console.log(err)
                            }else{
                                connection.query("SELECT * FROM `two`;",(err,datac)=>{
                                    if(err){
                                        console.log(err)
                                    }else{
                                         res.send({user:datas[0].name,data:datab,datas:datac})
                                    }
                                    connection.end()
                                })
                            }
                        })
                    }
                }
            })
        }
    })
})
app.use("/cont",(req,res)=>{
    var Pool = mysql.createPool({'host':'localhost','user':'root','password':'123456','database':'aa'});
    Pool.getConnection((err,connection)=>{
        if(err){
            console.log(err)
        }else{
            connection.query("SELECT * FROM `one`;",(err,datab)=>{
                if(err){
                    console.log(err)
                }else{
                    connection.query("SELECT * FROM `two`;",(err,datac)=>{
                        if(err){
                            console.log(err)
                        }else{
                             res.send({user:"login",data:datab,datas:datac})
                        }
                        connection.end()
                    })
                }
            })
        }
    })
})
app.use("/detail",(req,res)=>{
    var id=req.headers.referer.split("?")[1].split("=")[1]
    console.log(id)
    var Pool = mysql.createPool({'host':'localhost','user':'root','password':'123456','database':'aa'});
    Pool.getConnection((err,connection)=>{
        if(err){
            console.log(err)
        }else{
            connection.query("SELECT * FROM `one` WHERE ID='"+id+"';",(err,datab)=>{
                if(err){
                    console.log(err)
                }else{
                    connection.query("SELECT * FROM `two`;",(err,datac)=>{
                        if(err){
                            console.log(err)
                        }else{
                            connection.query("SELECT * FROM `one`;",(err,dataf)=>{
                                if(err){
                                    console.log(err)
                                }else{
                                    res.send({data:datab,datas:datac.reverse(),all:dataf.reverse()})
                                }
                                 connection.end()
                            })
                        }
                    })
                }
            })
        }
    })
})
app.use("/details",(req,res)=>{
    var id=req.headers.referer.split("?")[1].split("=")[1]
    console.log(id)
    var Pool = mysql.createPool({'host':'localhost','user':'root','password':'123456','database':'aa'});
    Pool.getConnection((err,connection)=>{
        if(err){
            console.log(err)
        }else{
            connection.query("SELECT name FROM `three` WHERE ID='"+req.query.userId+"';",(err,datas)=>{
                if(err){
                    console.log(err)
                }else{
                    if(datas.length>0){
                      connection.query("SELECT * FROM `one` WHERE ID='"+id+"';",(err,datab)=>{
                            if(err){
                                console.log(err)
                            }else{
                                connection.query("SELECT * FROM `two`;",(err,datac)=>{
                                    if(err){
                                        console.log(err)
                                    }else{
                                        connection.query("SELECT * FROM `one`;",(err,dataf)=>{
                                            if(err){
                                                console.log(err)
                                            }else{
                                                res.send({user:datas[0].name,data:datab,datas:datac.reverse(),all:dataf.reverse()})
                                            }
                                             connection.end()
                                        });
                                    };
                                });
                            };
                        });
                    };
                };
            });
        };
    });
});
app.use("/say",(req,res)=>{
    var Pool = mysql.createPool({'host':'localhost','user':'root','password':'123456','database':'aa'});
    console.log(req.query)
    var id=req.headers.referer.split("?")[1].split("=")[1]
    console.log(id)
    Pool.getConnection((err,connection)=>{
        if(err){
            console.log(err)
        }else{
             connection.query("SELECT * FROM `one` WHERE ID='"+id+"';",(err,datab)=>{
                if(err){
                    console.log(err)
                }else{
                    console.log(datab[0].say)
                    if(datab[0].say==""||datab[0].say==null||datab[0].say==undefined){
                        var arr=[]
                        console.log(req.query.say)
                        console.log(typeof req.query.say)
                        arr.push(req.query.say)
                    }else{
                        var arr=JSON.parse(datab[0].say)
                        arr.push(req.query.say)
                    }
                    connection.query("UPDATE `one` SET say='"+JSON.stringify(arr)+"' WHERE ID='"+id+"';",(err)=>{
                        if(err){
                            console.log(err)
                        }else{
                            console.log("成功")
                        }
                    })
                }
             })
        }
    })
})
app.use("/verification",(req,res)=>{
    console.log(req.query)
    var Pool = mysql.createPool({'host':'localhost','user':'root','password':'123456','database':'aa'});
    Pool.getConnection((err,connection)=>{
        if(err){
            console.log(err)
        }else{
            connection.query("SELECT * FROM `three` WHERE name='"+req.query.user+"' AND email='"+req.query.email+"';",(err,data)=>{
                if(err){
                    console.log(err)
                }else{
                    if(data.length>0){
                        res.send("验证成功")

                    }else{
                        res.send("验证失败")
                    }
                    connection.end()
                }
            })
        }
    })
});
app.use("/affirm",(req,res)=>{
    console.log(req.query)
    var Pool = mysql.createPool({'host':'localhost','user':'root','password':'123456','database':'aa'});
    Pool.getConnection((err,connection)=>{
        if(err){
            console.log(err)
        }else{
            connection.query("UPDATE `three` SET pass='"+req.query.pass+"' WHERE name='"+req.query.user+"';",(err,data)=>{
                if(err){
                    console.log(err)
                }else{
                    res.send("成功")
                }
                connection.end()
            })
        }
    })
});
app.use("/users",(req,res)=>{
    var Pool = mysql.createPool({'host':'localhost','user':'root','password':'123456','database':'aa'});
    Pool.getConnection((err,connection)=>{
        if(err){
            console.log(err)
        }else{
            connection.query("SELECT name FROM `three` WHERE ID='"+req.query.id+"';",(err,datas)=>{
                if(err){
                    console.log(err)
                }else{
                    if(datas.length>0){
                        console.log(datas[0].name)
                        res.send(datas[0].name)
                    }
                    connection.end()
                }
            })
        }
    })
})
app.use("",express.static("./"))