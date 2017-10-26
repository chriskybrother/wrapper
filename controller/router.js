var file = require("../model/file.js");
var url = require("url");
var fs = require("fs");
var fd = require("formidable");
var sd = require("silly-datetime");
var rf = require("rimraf");

//处理/请求的方法
exports.showIndex = function(req,res) {
    file.getDirs(function (err, files) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(files);
        res.render("index",{dirs:files});
    });
}
//处理 点击文件夹，显示文件夹内容的请求
exports.showPics = function(req,res,next){
    //获取请求参数
    var dirName = req.params.dirName;
    //调用file中读取文件夹内容图片的方法
    file.getPics(dirName,function(err,files){
        if(err){
            //console.log(err);
            next();
            return;
        }
        res.render("show",{imgs:files,dirName:dirName});
    });
}
//处理新建相册的请求
exports.newDir = function(req,res){
    //跳转到创建新文件夹的页面newdir.ejs
    res.render("newdir");
}
//新建相册
exports.mkDir = function(req,res){
    //新建文件夹，不能有同名
    //先获取upload下所有的文件夹，跟传进来的参数进行对比
//    如果有相同，说明同名
//    如果都不同，说明文件夹名可用
//    获取请求参数(get)
    var dirname = url.parse(req.url,true).query.dirName;
    file.getDirs(function(err,files){
        var flag = false;//假设起的名字没有重复
        for(var i=0;i<files.length;i++){
            //将dirname和每一个文件夹名进行比较
            if(dirname==files[i]){//说明同名
                //同名，假设不成立，将flag值改为true
                flag = true;
                res.send("<h1>文件夹已存在，<a href='/newdir'>返回</a></h1>");
                return;
            }
        }
        if(!flag){
            //flag为false，取反为true
            //说明假设是成立的
            fs.mkdir("./upload/"+dirname,function(err){
                if(err){
                    console.log(err);
                    return;
                }
                res.redirect("/");
            });
        }
    });

}
//跳转到上传页面
exports.uploadPage = function(req,res){
    file.getDirs(function(err,files){
        if(err){
            console.log(err);
            return;
        }
        //获取到文件夹名之后，将该名称传递给upload页面，用于生成每一个option
        res.render("upload",{dirs:files});
    });
}
//上传图片
exports.doUpload = function(req,res){
    //创建form表单
    var form = fd.IncomingForm();
    //设置上传路径
    form.uploadDir = "./upload";
    //解析请求，获取请求的参数(dirName)
    form.parse(req,function(err,fields,files){
        var dirName = fields.dirName;//获取参数，要上传的文件夹
        var file = files.pic;//获取上传的文件对象
        var oldPath = file.path;//文件的旧路径
        var name = file.name;//文件的名称，用于截取后缀名
        var arr = name.split(".");//将文件名拆分
        var extname = arr[arr.length-1];//后缀名
        //设置新路径
        var str = sd.format(new Date(),"YYYYMMDDHHmmss");
        var newPath = "./upload/"+dirName+"/"+str+"."+extname;
        //上传改名
        fs.rename(oldPath,newPath,function(err){
            if(err){
                console.log(err);
                res.send("重命名失败，<a href='/'>返回</a>");
            }
            //跳转到上传的那个文件夹
            res.redirect("/"+dirName);
        });
    });
}
//删除文件夹
exports.del = function(req,res){
    //获取需要删除的文件夹名
    var dirName = url.parse(req.url,true).query.dirname;
    //使用rimraf模块来删除非空文件夹
    rf("./upload/"+dirName,function(err){
        if(err){
            console.log(err);
        }
        res.redirect("/");
    });
}



