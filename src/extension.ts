import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let classMap: { [key: string]: string } = {};

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension activated');

    // Initial analysis of the workspace directory
    analyzeWorkspace();

    // Periodic analysis of the workspace directory
    setInterval(analyzeWorkspace, 30000);

    // Register command for adding include
    let disposableInclude = vscode.commands.registerCommand('extension.addInclude', () => {
        vscode.window.showInformationMessage('Include command executed!');
    });

    // Register command for workspace analysis
    let disposableAnalyze = vscode.commands.registerCommand('extension.makeAnalysis', () => {
        analyzeWorkspace();
        vscode.window.showInformationMessage('Workspace analysis executed!');
    });

    context.subscriptions.push(disposableInclude);
    context.subscriptions.push(disposableAnalyze);

    // Handle autocompletion suggestions
    vscode.languages.registerCompletionItemProvider('*', {
        provideCompletionItems(document, position, token, context) {
            const line = document.lineAt(position);
            const wordRange = document.getWordRangeAtPosition(position, /[\w$]+/);
            const currentWord = wordRange ? document.getText(wordRange) : '';
            let completions: vscode.CompletionItem[] = [];

            Object.keys(classMap).forEach(className => {
                if (className.toLowerCase().includes(currentWord.toLowerCase())) {
                    let item = new vscode.CompletionItem(className, vscode.CompletionItemKind.Class);
                    item.detail = `Add #include "${classMap[className]}"`;
                    item.insertText = `#include "${classMap[className]}"`;
                    completions.push(item);
                }
            });

            return completions;
        }
    });
}

function analyzeWorkspace() {
    classMap = {}; // Clear previous results
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders) {
        workspaceFolders.forEach(folder => {
            scanDirectory(folder.uri.fsPath);
        });
    }
    console.log('Analysis completed:', classMap);
}

function scanDirectory(dir: string) {
    fs.readdir(dir, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }
        files.forEach(file => {
            let fullPath = path.join(dir, file);
            fs.stat(fullPath, (err, stats) => {
                if (err) {
                    console.error('Error getting file status:', err);
                    return;
                }
                if (stats.isDirectory()) {
                    scanDirectory(fullPath);
                } else if (stats.isFile()) {
                    if (fullPath.endsWith('.cpp') || fullPath.endsWith('.h') || fullPath.endsWith('.hpp')) {
                        analyzeFile(fullPath);
                    }
                }
            });
        });
    });
}

function analyzeFile(filePath: string) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        const classRegex = /class\s+(\w+)/g;
        let match;
        while ((match = classRegex.exec(data)) !== null) {
            let className = match[1];
            let relativePath = path.relative(vscode.workspace.rootPath || '', filePath);
            classMap[className] = relativePath;
        }
    });
}

export function deactivate() {
    console.log('Extension deactivated');
}
