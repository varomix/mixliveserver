'use strict';
var vscode = require('vscode');
var liveserver = require('live-server');
var config = vscode.workspace.getConfiguration('mix');
var projectPath = vscode.workspace.rootPath + "/" + config["rootPath"];
function activate(context) {
    var previewUri = vscode.Uri.parse('mixliveserver://autority/' + config["rootPath"] + '/index.html');
    var params = {
        port: config["port"],
        root: projectPath,
        open: false,
    };
    // start the server
    liveserver.start(params);
    var MixLiveServerContentProvider = (function () {
        function MixLiveServerContentProvider() {
            this._onDidChange = new vscode.EventEmitter();
        }
        MixLiveServerContentProvider.prototype.provideTextDocumentContent = function (uri) {
            return "<!DOCTYPE html><html><head><style>\n\t\thtml, body, canvas, div {\n\t\t\tmargin:0;\n\t\t\tpadding: 0;\t\t\t\n\t\t\twidth:100%;\n\t\t\theight:100%;\n\t\t}\n\t\t#khanvas {\n\t\t\tdisplay:block;\n\t\t\tborder:none;\n\t\t\toutline:none;\n\t\t}\n\t</style></head><body><iframe src=\"http://127.0.0.1:8181\" width=\"100%\" height=\"100%\" frameBorder=\"0\"></iframe><div class=\"svgbg\"></div></body></html>";
        };
        return MixLiveServerContentProvider;
    }());
    var provider = new MixLiveServerContentProvider();
    var registration = vscode.workspace.registerTextDocumentContentProvider('mixliveserver', provider);
    var open = vscode.commands.registerTextEditorCommand('mixliveserver.open', function (te, t) {
        return vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two)
            .then(function (s) { return console.log('done.'); }, vscode.window.showErrorMessage);
    });
    context.subscriptions.push(open);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map