#!/usr/bin/env node

/*
 * Remove junk files from the project before build so they don't get compiled
 * into the application, preventing unwanted bloat.
 */

var fs = require("fs");
var path = require("path");

// All directories in the www path that you want scanned for junk
var foldersToProcess = [
    "js",
    "css"
];

// An array of files that you consider junk and want removed
var junkFileList = [
    ".DS_Store",
    "Thumbs.db"
]

foldersToProcess.forEach(function(folder) {
    processFiles("www/" + folder);
});

function processFiles(dir) {
    console.log("Scanning directory for junk...");
    fs.readdir(dir, function(err, list) {
        if(err) {
            console.log("File processing error " + err);
            return;
        }
        list.forEach(function(file) {
            file = dir + "/" + file;
            fs.stat(file, function(err, stat) {
                if(!stat.isDirectory()) {
                    if(junkFileList.indexOf(path.basename(file)) === 0) {
                        fs.unlink(file, function(error) {
                            console.log("Removed file " + file);
                        });
                    } else {
                        console.log("Skipping file " + file);
                    }
                }
            });
        });
    });
}
