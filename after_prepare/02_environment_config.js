#!/usr/bin/env node
/**
 * Detect the current target by looking at the TARGET env variable.
 * If TARGET does not exist, make no change.
 * Otherwise, replace www/js/environment.js with environment-xxxx.js (where TARGET=xxxx)
 * If environment-xxxx.js doesn't exist, execution will fail.
 *
 * Set the target for only one build as:
 *    $ TARGET=prod ionic build [platform]
 *
 * The example above will carry the environment variable through all called processes,
 *    such as the ionic build command called by release-ios and release-android.
 */

/*
 * Sample <project_home>/www/js/environment.js:
    var appEnvironment = {
        host: 'http://staging-domain.com'
    };

 * Sample <project_home>/environment-prod.js:
    var appEnvironment = {
        host: 'https://production-domain.com'
    };
 */
var wwwFileToReplace = "js/environment.js";

var fs = require("fs");
var path = require("path");

var rootdir = process.argv[2];

var currentBuildPlatforms = process.env.CORDOVA_PLATFORMS.split(",");
console.log("Current build platforms: ", currentBuildPlatforms);

if (rootdir && process.env.TARGET) {
    var srcfile = path.join(rootdir, "environment-" + process.env.TARGET.toLowerCase() + ".js");
    if (fs.existsSync(srcfile)) {
        currentBuildPlatforms.forEach(function(val, index, array) {
            var wwwPath = "";
            switch(val) {
                case "ios":
                    wwwPath = "platforms/ios/www/";
                    break;
                case "android":
                    wwwPath = "platforms/android/assets/www/";
                    break;
                default:
                    console.log("Unknown build platform: " + val);
            }
            var destfile = path.join(rootdir, wwwPath + wwwFileToReplace);
                fs.createReadStream(srcfile).pipe(fs.createWriteStream(destfile));
                console.log("Replaced file: " + destfile + " with file: " + srcfile);
        });
    } else {
        console.log("ERROR: Unable to find target srcfile '" + srcfile + "'");
    }
} else {
    console.log("TARGET environment variable is not set.  Using default values.");
}
