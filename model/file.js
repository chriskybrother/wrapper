//读取文件数据，将读取到的数据返回给controller(router.js)
var fs = require("fs");

//读取upload文件夹下的所有文件夹
exports.getDirs = function(callback) {
    fs.readdir("./upload", function (err, files) {
        if (err) {
            //console.log(err);
            //出错，第1个参数位错误信息。第二个参数为null
            callback(err,null);
        }
        //console.log("FILE:",files);
        //正确返回数据，没有错误，第一个参数为null，第二个参数为数据
        //callback(null,files);
        //遍历files，选取其中的文件夹保存进一个数组并返回
        var dirs = [];
        (function a(i){
            if(i>=files.length){//迭代结束
                //返回数据
                callback(null,dirs);
                return;
            }
            fs.stat("./upload/"+files[i],function(err,stats){
                if(err){
                    callback(err,null);
                    return;
                }
                if(stats.isDirectory()){//如果是文件夹
                    dirs.push(files[i]);
                }
                a(++i);//调用自身，进入下一次循环
            });
        })(0);


    });
}

//读取某个文件夹内的图片
exports.getPics = function(dirName,callback){
    fs.readdir("./upload/"+dirName,function(err,files){
        if(err){
            callback(err,null);
            return;
        }
        var pics = [];//预存图片的数组
        (function a(i){
            if(i>=files.length){
                callback(null,pics);
                return;
            }
            var path = "./upload/"+dirName+"/"+files[i];
            fs.stat(path,function(err,stats){
                if(err){
                    callback(err,null);
                    return;
                }
                if(stats.isFile()){
                    pics.push(files[i]);
                }
                a(++i);
            });
        })(0);
    });
}

//创建新的文件夹
exports.newDir = function(){

}

