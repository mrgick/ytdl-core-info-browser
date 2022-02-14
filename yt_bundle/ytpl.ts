const proxyquire = require('proxyquireify')(require);
const realMiniget = require('miniget');
// We import the library so it cached before using proxyquire
const ytpl = require('ytpl');

interface YtplBrowserOptions {
    proxyUrl: string; // Ex: 'https://cors-anywhere.herokuapp.com/'
    proxyquireStubs?: any;
}

module.exports = (options: YtplBrowserOptions) => {
    return proxyquire('ytpl', {
        miniget(url, opts) {
            return realMiniget(options.proxyUrl + url, opts);
        },
        ...(options.proxyquireStubs || {})
    });
};
