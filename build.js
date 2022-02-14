var browserify = require('browserify');
var proxyquire = require('proxyquireify');
const tsify = require('tsify');
const fs = require('fs');
const replace = require('replace-in-file');

browserify()
    .require('./yt_bundle/ytdl.ts', {
        expose: 'ytdl-core-browser'
    })
    .plugin(tsify, {
        declaration: true,
        declarationMap: true,
        sourceMap: true
    })
    .plugin(proxyquire.plugin)
    .bundle()
    .pipe(fs.createWriteStream('./dist/ytdl.js'));


browserify()
    .require('./yt_bundle/ytpl.ts', {
        expose: 'ytpl-browser'
    })
    .plugin(tsify, {
        declaration: true,
        declarationMap: true,
        sourceMap: true
    })
    .plugin(proxyquire.plugin)
    .bundle()
    .pipe(fs.createWriteStream('./dist/ytpl.js'));

async function replace_env() {
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    await sleep(10000)

    try {
        const results = await replace({
            files: './dist/ytdl.js',
            from: 'process.env.YTDL_NO_UPDATE',
            to: '1'
        });
        if (!results[0].hasChanged) {
            console.error("Error occurred: didn't find env");
        }
    }
    catch (error) {
        console.error('Error occurred:', error);
    }
};

replace_env();