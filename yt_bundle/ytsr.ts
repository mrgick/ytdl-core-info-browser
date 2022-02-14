const proxyquire = require('proxyquireify')(require);
const realMiniget = require('miniget');
const ytpl = require('ytsr');

interface YtsrBrowserOptions {
    proxyUrl: string;
    proxyquireStubs?: any;
}

module.exports = (options: YtsrBrowserOptions) => {
    return proxyquire('ytsr', {
        miniget(url, opts) {
            return realMiniget(options.proxyUrl + url, opts);
        },
        ...(options.proxyquireStubs || {})
    });
};
