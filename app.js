var express = require("express");
var route = require("./controller/router.js");
var app = express();
var fs = require("fs");
app.listen(4000);
//设置视图引擎
app.set("view engine","ejs");
//设置public为根目录
app.use(express.static("./public"));
app.use(express.static("./upload"));
//处理/请求
app.get("/",route.showIndex);
//处理新建相册的请求(跳转到新建页面)
app.get("/newdir",route.newDir);
//处理新建相册的请求(新建)
app.get("/mkdir",route.mkDir);
//上传图片(跳转到上传图片页面)
app.get("/upload",route.uploadPage);
//删除文件夹
app.get("/del",route.del);
//处理点击文件夹，显示文件夹内容的请求
//因为文件夹名称不固定，所以不能写具体的请求，而将文件夹名作为参数传递进来
app.get("/:dirName",route.showPics);
//处理上传图片
app.post("/doUpload",route.doUpload);

//处理错误的请求
//app.use("/",fn)
app.use(function(req,res){
    res.send("<h1>请求错误，点击<a href='/'>返回</a></h1>");
    //res.render("error")
});





