const browserify = require('browserify');
const proxyquire = require('proxyquireify');
const tsify = require('tsify');
const fs = require('fs');
const replace = require('replace-in-file');
const { minify } = require("terser");

async function doBrowserify() {

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
        .pipe(fs.createWriteStream('./dist/ytdl.js'))



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



    browserify()
        .require('./yt_bundle/ytsr.ts', {
            expose: 'ytsr-browser'
        })
        .plugin(tsify, {
            declaration: true,
            declarationMap: true,
            sourceMap: true
        })
        .plugin(proxyquire.plugin)
        .bundle()
        .pipe(fs.createWriteStream('./dist/ytsr.js'));
}

async function replaceEnv() {
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


async function minimizeFiles() {
    async function doMinimize(fileName, options) {
        let res = await minify(fs.readFileSync('./dist/' + fileName, "utf8"), options);
        fs.writeFileSync('./dist/' + fileName.replace('.js', '.min.js'), res.code, "utf8");
    }
    let options = {
        toplevel: true,
        compress: {
            dead_code: true
        },
        format: {
            comments: false
        }
    }

    doMinimize('ytdl.js', options)
    doMinimize('ytpl.js', options)
    doMinimize('ytsr.js', options)
}


async function main() {

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    await doBrowserify()
    await sleep(20000)
    await replaceEnv()
    await minimizeFiles()
}

main()