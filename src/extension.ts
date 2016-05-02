'use strict';

import * as vscode from 'vscode';
var liveserver = require('live-server');
var config = vscode.workspace.getConfiguration('mix');
var projectPath = vscode.workspace.rootPath + "/" + config["rootPath"];

export function activate(context: vscode.ExtensionContext) {
    
    let previewUri = vscode.Uri.parse('mixliveserver://autority/' + config["rootPath"] + '/index.html');
    
    var params = {
        port: config["port"], // Set the server port. Defaults to 8080.
        root: projectPath, // Set root directory that's being server. Defaults to cwd.
        open: false, // When false, it won't load your browser by default.
    };

        // start the server
        liveserver.start(params);
    
class MixLiveServerContentProvider implements vscode.TextDocumentContentProvider{
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    
    public provideTextDocumentContent(uri:vscode.Uri):string{
        return `<!DOCTYPE html><html><head><style>
		html, body, canvas, div {
			margin:0;
			padding: 0;			
			width:100%;
			height:100%;
		}
		#khanvas {
			display:block;
			border:none;
			outline:none;
		}
	</style></head><body><iframe src="http://127.0.0.1:8181" width="100%" height="100%" frameBorder="0"></iframe><div class="svgbg"></div></body></html>`;
    }
}

let provider = new MixLiveServerContentProvider();
let registration = vscode.workspace.registerTextDocumentContentProvider('mixliveserver', provider);

let open = vscode.commands.registerTextEditorCommand('mixliveserver.open', (te, t) => {
    return vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two)
            .then(s => console.log('done.'), vscode.window.showErrorMessage);
});

context.subscriptions.push(open);

}

// this method is called when your extension is deactivated
export function deactivate() {
}