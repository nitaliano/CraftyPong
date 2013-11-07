var http = require("http"),
    url = require('url'),
    path = require('path'),
    fs = require('fs');

http.createServer(function (req, res) {
  var uri = url.parse(req.url).pathname,
      filename = path.join(process.cwd(), uri);
  
  var contentTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css'
  };
  
  fs.exists(filename, function (exists) {
    if (!exists) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('404 Not Found');
      return;
    }
    
    if (fs.statSync(filename).isDirectory()) {
      filename += 'index.html';  
    }
    
    fs.readFile(filename, function (err, file) {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end(JSON.stringify(err));
        return;
      }
      
      var contentType = path.extname(filename);
      if (contentType) {
        res.writeHead(200, {'Content-Type': contentTypes[contentType] });
        res.end(file);
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('No file extension could be found');
      }
    });
  });
}).listen(8888, process.env.IP);