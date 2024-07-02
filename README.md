# Disclamer
This is based on a [fork](https://www.npmjs.com/package/ytdl-core-browser).
By July 02, 2024, it is working.

# Browser Youtube Downloader
This library is a tiny wrapper around the [ytdl-core](https://www.npmjs.com/package/ytdl-core) library to make it work in the browser.
Also add other stuff - such as ytpl and ytsr.
We don't care about bugs and issues, do what you want. **This library is just a proof of concept**.
[free js static CDN](https://cdn.jsdelivr.net/npm/ytdl-core-info-browser@latest/)

***Have fun!*** 

## Explanations
In order to make ytdl-core work in the browser, we use two steps:
1. We [browserify]() the source code
2. We use [proxyquireify](https://www.npmjs.com/package/proxyquireify) to mock [miniget](https://www.npmjs.com/package/miniget) and [m3u8stream](https://www.npmjs.com/package/m3u8stream) to bypass CORS errors by YouTube.


## Usage
Here is an example usage. You can replace `/dist/ytdl.js` with the path to the library's
entry file.

```html
...
<body>
    ...
    <script src="/dist/ytdl.js"></script>
    <script>
        const ytdl = window.require('ytdl-core-browser')({
            proxyUrl: 'https://cors-anywhere.herokuapp.com/',
            // proxyquireStubs: {}, arguments mapped directly to proxyquireify
            // For more info, see https://www.npmjs.com/package/proxyquireify
        });
        ytdl
            .getInfo('https://www.youtube.com/watch?v=WPdbEbwNTcU')
            .then(info=>console.log(info))
            .catch(err=>{throw err;});
    </script>
</body>
```

## Customize
This is the source code of the library: 

```ts
const proxyquire = require('proxyquireify')(require); 
const realMiniget = require('miniget');
const m3u8stream = require('m3u8stream');
// We import the library so it cached before using proxyquire
const ytdlCore = require('ytdl-core');

interface YtdlBrowserOptions {
    proxyUrl: string; // Ex: 'https://cors-anywhere.herokuapp.com/'
    proxyquireStubs?: any;
}

module.exports = (options: YtdlBrowserOptions) => {
    return proxyquire('ytdl-core', {
        miniget(url, opts){
            return realMiniget(options.proxyUrl + url, opts);
        },
        m3u8stream(url, opts){
            return m3u8stream(options.proxyUrl + url, opts);
        },
        ...(options.proxyquireStubs || {})
    });
};
```

You are very welcomed to hack the settings (especially with option `proxyquireStubs`).
For instance, if you want to use a custom implementation of the miniget library:
```js
const ytdl = window.require('ytdl-core-browser')({
    proxyUrl: ...
    proxyquireStubs: {
        miniget(url,options){
            // Your custom mock of miniget(...)
        },
        m3u8stream(url, options){
            // Your custom mock of m3u8stream(...)
        }
    }
})
```