#!/usr/bin/env node
// Submits showcase URLs to IndexNow (https://www.indexnow.org/), which forwards them to Bing and the other
// participating search engines. Bing's Webmaster Guidelines recommend doing so whenever URLs are added, updated,
// or removed instead of waiting for Bingbot to schedule a crawl.
//
// Run it after a production deployment: IndexNow verifies the key against the live /<key>.txt file.
// Exit codes: 0 submission accepted (HTTP 200 or 202), 1 network or protocol failure, 2 usage error.
import {
    describeIndexNowStatus,
    INDEXNOW_ENDPOINT,
    INDEXNOW_KEY,
    INDEXNOW_KEY_PATH,
    indexNowPayload,
    isIndexNowSuccess,
    parseIndexNowArgs,
    sitemapUrls
} from '../src/routes/(common)/indexnow.js';
import { SITE_URL } from '../src/routes/(common)/site-url.js';

const USAGE = `Usage: pnpm indexnow [--dry-run] [path-or-url ...]

  (no arguments)        submit every URL in the live sitemap
  /components/button    submit specific pages (site-relative paths or absolute URLs)
  --dry-run             print the request without sending it
  -h, --help            show this help
`;

/**
 * @param {unknown} error
 * @param {number} code
 * @returns {never}
 */
function fail(error, code) {
    console.error(error instanceof Error ? error.message : String(error));
    if (code === 2) console.error(`\n${USAGE}`);
    process.exit(code);
}

async function assertKeyFileIsLive() {
    const url = `${SITE_URL}${INDEXNOW_KEY_PATH}`;
    const response = await fetch(url);
    const body = response.ok ? (await response.text()).trim() : '';
    if (body !== INDEXNOW_KEY) {
        throw new Error(`${url} is not serving the IndexNow key (HTTP ${response.status}); deploy to production first.`);
    }
}

async function liveSitemapUrls() {
    const url = `${SITE_URL}/sitemap.xml`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Could not read ${url}: HTTP ${response.status}`);
    return sitemapUrls(await response.text());
}

let options;
try {
    options = parseIndexNowArgs(process.argv.slice(2));
} catch (error) {
    fail(error, 2);
}

if (options.help) {
    console.log(USAGE);
    process.exit(0);
}

// Explicit URLs are validated before the first network request, so a mistake fails fast and offline.
let payload;
if (options.urls.length > 0) {
    try {
        payload = indexNowPayload(options.urls);
    } catch (error) {
        fail(error, 2);
    }
}

try {
    await assertKeyFileIsLive();
    payload ??= indexNowPayload(await liveSitemapUrls());
} catch (error) {
    fail(error, 1);
}

console.log(`${options.dryRun ? 'Would submit' : 'Submitting'} ${payload.urlList.length} URL(s) for ${payload.host} to ${INDEXNOW_ENDPOINT}`);
if (options.dryRun) {
    console.log(JSON.stringify(payload, null, 2));
} else {
    let response;
    try {
        response = await fetch(INDEXNOW_ENDPOINT, {
            method: 'POST',
            headers: { 'content-type': 'application/json; charset=utf-8' },
            body: JSON.stringify(payload)
        });
    } catch (error) {
        fail(error, 1);
    }
    console.log(`HTTP ${response.status}: ${describeIndexNowStatus(response.status)}`);
    const body = (await response.text()).trim();
    if (body) console.log(body);
    process.exitCode = isIndexNowSuccess(response.status) ? 0 : 1;
}
