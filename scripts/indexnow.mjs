#!/usr/bin/env node
// Submits showcase URLs to IndexNow (https://www.indexnow.org/), which forwards them to Bing and the other
// participating search engines. Bing's Webmaster Guidelines recommend doing so whenever URLs are added, updated,
// or removed instead of waiting for Bingbot to schedule a crawl.
//
//   pnpm indexnow                       submit every URL in the live sitemap
//   pnpm indexnow /components/button    submit specific pages (paths or absolute URLs)
//   pnpm indexnow --dry-run             print the request without sending it
//
// Run it after a production deployment: IndexNow verifies the key against the live /<key>.txt file.
import {
    describeIndexNowStatus,
    INDEXNOW_ENDPOINT,
    INDEXNOW_KEY,
    INDEXNOW_KEY_PATH,
    indexNowPayload,
    sitemapUrls
} from '../src/routes/(common)/indexnow.js';
import { SITE_URL } from '../src/routes/(common)/site-url.js';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const requested = args.filter((arg) => !arg.startsWith('--')).map((arg) => (arg.startsWith('/') ? `${SITE_URL}${arg}` : arg));

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

await assertKeyFileIsLive();
const payload = indexNowPayload(requested.length > 0 ? requested : await liveSitemapUrls());

console.log(`${dryRun ? 'Would submit' : 'Submitting'} ${payload.urlList.length} URL(s) for ${payload.host} to ${INDEXNOW_ENDPOINT}`);
if (dryRun) {
    console.log(JSON.stringify(payload, null, 2));
} else {
    const response = await fetch(INDEXNOW_ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload)
    });
    console.log(`HTTP ${response.status}: ${describeIndexNowStatus(response.status)}`);
    const body = (await response.text()).trim();
    if (body) console.log(body);
    process.exitCode = response.ok ? 0 : 1;
}
