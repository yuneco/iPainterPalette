const http      = require('http');
const httpProxy = require('http-proxy');
const fs        = require('fs'); 

// 設定 必要に応じて変更してください
const painterHost   = '127.0.0.1';
const painterPort   = '26735';
const proxyPort     = 8080;

const proxy     = httpProxy.createProxyServer({});
const server    = http.createServer();
const DEFAULT_FILE = "index.html"; 

//ref: https://blogs.msdn.microsoft.com/osamum/2015/05/29/web-node-js-web/

//拡張子を抽出 
function getExtension(fileName) { 
    var fileNameLength = fileName.length; 
    var dotPoint = fileName.indexOf('.', fileNameLength - 5 ); 
    var extn = fileName.substring(dotPoint + 1, fileNameLength); 
    return extn; 
} 

//content-type を指定 
function getContentType(fileName) { 
    var extentsion = getExtension(fileName).toLowerCase(); 
    var contentType = { 
        'html': 'text/html', 
        'htm' : 'text/htm', 
        'css' : 'text/css', 
        'js' : 'text/javaScript; charset=utf-8', 
        'json' : 'application/json; charset=utf-8', 
        'xml' : 'application/xml; charset=utf-8', 
        'jpeg' : 'image/jpeg', 
        'jpg' : 'image/jpg', 
        'gif' : 'image/gif', 
        'png' : 'image/png', 
        'mp3' : 'audio/mp3', 
        }; 
        var contentType_value = contentType[extentsion]; 
        if(contentType_value === undefined){ 
            contentType_value = 'text/plain';}; 
    return contentType_value; 
} 

//Web サーバーのロジック 
server.on('request', 
    function(request, response){ 
        const reqUrl        = request.url;
        if(reqUrl.match(/^\/local\//)){
            
            // return local resources

            const requestedFile = (reqUrl.substring(reqUrl.length - 1, 1) === '/')?reqUrl + DEFAULT_FILE : reqUrl; 
            fs.readFile('.' + requestedFile,'binary', function (err, data) { 
                var   respCode      = 500;
                if(err){ 
                    respCode    = 404;
                    response.writeHead(respCode, {'Content-Type': 'text/plain'}); 
                    response.write('not found\n'); 
                    response.end();    
                }else{ 
                    respCode    = 200;
                    response.writeHead(respCode, {'Content-Type': getContentType(requestedFile)}); 
                    response.write(data, "binary"); 
                    response.end(); 
                } 
                console.log(new Date() , respCode , reqUrl); 
        }); 
    
        }else{

            //otherwise proxy to Painter web server
            console.log(new Date() , 'proxy' , reqUrl); 
            proxy.web(request,response,{target:{
                host    :   painterHost
                ,port   :   painterPort
            }});
        }

      } 
); 

server.listen(proxyPort);
