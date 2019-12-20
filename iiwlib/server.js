/**
 * iiw框架分布式项目开发运行环境，配置nodejs启动server.js
 *
 * Created by YJJ on 2015-09-11.
 *
 * V1.0
 */
var _libpath = 'C:\\Users\\chq\\Desktop\\iotimc\\iiwlib\\node_modules\\';

var _serverPort = parseInt(Math.random() * 9999) + 10000;
var _defaultPath = '';

var _path = require('path');
var express = require(_libpath + 'express');
var app = express();

var packagejson = require(_path.join(process.cwd(), 'package.json'));

// 设置允许跨域获取资源
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

if(!packagejson.path) packagejson.path = _defaultPath;

if(packagejson.host && packagejson.client) {
    app.use('/' + (packagejson.path ? (packagejson.path + '/') : '') + packagejson.name, express.static(_path.join(process.cwd())));
    packagejson.host = 'http://' + packagejson.host + (packagejson.path ? ('/'+ packagejson.path) : '');
    packagejson.client = 'http://' + packagejson.client + ':' + _serverPort + (packagejson.path ? ('/'+ packagejson.path) : '');

    sendSoaInfo(packagejson, true);
    setInterval(function() {
        sendSoaInfo(packagejson);
    }, 10 * 1000);
} else {
    console.error('服务启动失败，缺少配置信息，请在package.json文件中配置host[主框架ip:端口]和client[本地ip]参数！');
}


function sendSoaInfo(json, init) {
    var request = require(_libpath + 'request');

    if(json['description']) delete json['description'];

    var options = {
        url: json.host + '/soa/setInfo',
        method: 'POST',
        json: true,
        body: json
    };

    request(options, function(error, res, data) {
        if(!error && res.statusCode == 200 && data.status == 1) {
            if(init) {
                app.listen(_serverPort, function () {
                    console.log('服务已启动，监听端口：' + _serverPort);
                });
            }
        } else {
            if(error && error == 'Error: connect ECONNREFUSED') {
                console.error('服务运行失败，失败原因：无法连接到主框架服务器，请检查[' + options.url + ']网络是否正常，主框架服务是否启动！');
            } else if(error){
                console.error('服务运行失败，失败原因：' + error);
            } else {
                console.error('服务运行失败，失败原因[' + res.statusCode + ']：无法连接到主框架服务接口，请检查[' + options.url + ']接口是否正常！');
            }
            if(init) {
                setTimeout(function() {
                    process.exit(0);
                }, 100);
            }
        }
    });
}
