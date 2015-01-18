#!/usr/bin/env node

/*
 * Lint all JavaScript files in the listed directories for errors.  If errors
 * are found, stop the build proccess until they are corrected.
 */

var fs = require("fs");
var path = require("path");
var jshint = require("jshint").JSHINT;

var filesWithErrorsCount = 0;

// All directories that contain JavaScript in the www path of your project you want linted
var foldersToProcess = [
    "js"
];

foldersToProcess.forEach(function(folder) {
    filesWithErrorsCount += processFiles("www/" + folder);
});

if(filesWithErrorsCount > 0) {
    console.log("There were " + filesWithErrorsCount + " files with errors");
    process.exit(1);
}

function processFiles(dir, callback) {
    var errorCount = 0;
    var fileList = fs.readdirSync(dir);
    fileList.forEach(function(file) {
        file = dir + "/" + file;
        var fileStat = fs.statSync(file);
        if(!fileStat.isDirectory()) {
            if(path.extname(file) === ".js" && file.indexOf(".min.js") === -1) {
                errorCount += lintFile(file);
            }
        }
    });
    return errorCount;
}

function lintFile(file) {
    console.log("Linting " + file);
    var fileData = fs.readFileSync(file);
    if(jshint(fileData.toString())) {
        console.log("File " + file + " has no errors.");
        console.log("-----------------------------------------");
        return 0;
    } else {
        console.log("Errors in file " + file);
        var out = jshint.data(),
        errors = out.errors;
        for(var j = 0; j < errors.length; j++) {
            console.log(errors[j].line + ":" + errors[j].character + " -> " + errors[j].reason + " -> " + errors[j].evidence);
        }
        console.log("-----------------------------------------");
        return 1;
    }
}
