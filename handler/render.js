const { parse } = require('url');
const { parseTarget, endWithCache, endWithError } = require('../lib/util')('render');
const chromium = require('../lib/chromium');

const render = async (targetURL) => {
    const { browser, page, err } = await chromium.visit(targetURL)
    if (err) {
        return { err }
    }

    // serialize HTML of page DOM
    let html = await page.content();
    await browser.close();

    const { protocol, hostname } = parse(targetURL)

    html = html.replace('<head>', `<head><base href="${protocol}//${hostname}"/>`)
    return { html };
}

module.exports = async function (req, res) {
    const { target, err: targetErr } = parseTarget(req)
    if (targetErr) {
        return endWithError(res, targetErr)
    }
    
    try {
        const { html, err: handlerErr } = await render(target);
        if (handlerErr) {
            return endWithError(res, handlerErr)
        }

        return endWithCache(res, 200, 'text/html', html);
    } catch (e) {
        return endWithError(res, {
            message: `screenshot failed for target '${target}'.`,
            errorObject: e,
        })
    }
};
