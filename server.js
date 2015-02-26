// based on https://github.com/modesty/p2jsvc/blob/master/lib/service.js
var fs = require('fs');
var _ = require('underscore');
var restify = require('restify');
var PDFParser = require('pdf2json/pdfparser');

var server = restify.createServer({
    name: 'pdf2json-ws',
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.jsonp());
server.use(restify.gzipResponse());
server.pre(restify.pre.userAgentConnection());

var _onPFBinDataReady = function(data) {
    this.res.send(data.data);
};

server.post('/pdf', function(req, res, next) {
    console.log('parsing file ' + req.files.pdf.name + ' (' + req.files.pdf.path + ')');
    var pdfParser = new PDFParser();
    pdfParser.on("pdfParser_dataReady", _.bind(_onPFBinDataReady, {res: res}));
    fs.readFile(req.files.pdf.path, function (err, pdfBuffer) {
        if (!err) {
            pdfParser.parseBuffer(pdfBuffer);
        }
        else {
            res.send('ERROR');
        }
    })
});

server.listen(8080);
