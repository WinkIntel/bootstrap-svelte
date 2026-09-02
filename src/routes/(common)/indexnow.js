// @ts-check
/**
 * IndexNow support for the showcase (https://www.indexnow.org/).
 *
 * Bing's Webmaster Guidelines ask sites to notify Bing through IndexNow when URLs are added, updated, or removed rather
 * than waiting for Bingbot to schedule a crawl; it is Bing's primary remedy for URLs that stay "Discovered but not
 * crawled". The protocol needs a key hosted on the site (`static/<key>.txt`, served at `/<key>.txt`) and one POST per
 * batch of URLs to the shared API, which forwards submissions to every participating engine.
 *
 * Plain JavaScript so `scripts/indexnow.mjs` can import it without a build step.
 */
import { SITE_URL } from './site-url.js';

/** Public by design: the key only proves that whoever submits URLs also controls this host. */
export const INDEXNOW_KEY = '2021483da7bef83eda442e5ca179aa12';
export const INDEXNOW_KEY_PATH = `/${INDEXNOW_KEY}.txt`;
export const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
/** The protocol's per-request limit. */
export const INDEXNOW_MAX_URLS = 10_000;

/** @type {Record<string, string>} */
const XML_ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

/** @param {string} text */
function decodeXmlEntities(text) {
    return text.replace(/&(?:([a-z]+)|#(\d+)|#x([0-9a-fA-F]+));/g, (entity, name, decimal, hex) => {
        if (decimal) return String.fromCodePoint(Number(decimal));
        if (hex) return String.fromCodePoint(parseInt(hex, 16));
        return XML_ENTITIES[name] ?? entity;
    });
}

/**
 * Every `<loc>` of a sitemap, in document order.
 * @param {string} xml
 * @returns {string[]}
 */
export function sitemapUrls(xml) {
    return [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((match) => decodeXmlEntities((match[1] ?? '').trim()));
}

/**
 * The JSON body of one IndexNow submission for `urls`, which must all live on the site the key file vouches for.
 * @param {readonly string[]} urls
 * @returns {{ host: string, key: string, keyLocation: string, urlList: string[] }}
 */
export function indexNowPayload(urls) {
    const urlList = [...new Set(urls)];
    if (urlList.length === 0) throw new Error('No URLs to submit.');
    if (urlList.length > INDEXNOW_MAX_URLS) throw new Error(`IndexNow accepts at most 10,000 URLs per request; got ${urlList.length}.`);

    const foreign = urlList.filter((url) => !url.startsWith(`${SITE_URL}/`));
    if (foreign.length > 0) throw new Error(`Only URLs under ${SITE_URL}/ can be submitted with this key: ${foreign.join(', ')}`);

    return { host: new URL(SITE_URL).host, key: INDEXNOW_KEY, keyLocation: `${SITE_URL}${INDEXNOW_KEY_PATH}`, urlList };
}

/**
 * What an IndexNow response status means, in the protocol's own terms.
 * @param {number} status
 * @returns {string}
 */
export function describeIndexNowStatus(status) {
    switch (status) {
        case 200:
            return 'OK: URLs submitted.';
        case 202:
            return 'Accepted: URLs received, key validation is pending.';
        case 400:
            return 'Bad request: invalid format.';
        case 403:
            return 'Forbidden: the key is invalid or does not match the hosted key file.';
        case 422:
            return 'Unprocessable: URLs do not belong to the host, or the key does not match the key file location.';
        case 429:
            return 'Too many requests: submissions are being rate limited as potential spam.';
        default:
            return `Unexpected HTTP ${status}; only 200 and 202 mean the submission was accepted.`;
    }
}

/** The only response statuses the protocol defines as a successful submission. */
export const INDEXNOW_SUCCESS_STATUSES = [200, 202];

/**
 * Whether `status` means IndexNow accepted the submission. Other 2xx codes are undefined by the protocol and count as
 * failures, so automation can never record a false success.
 * @param {number} status
 * @returns {boolean}
 */
export function isIndexNowSuccess(status) {
    return INDEXNOW_SUCCESS_STATUSES.includes(status);
}

/** @type {Record<string, 'dryRun' | 'help' | undefined>} */
const CLI_OPTIONS = { '--dry-run': 'dryRun', '--help': 'help', '-h': 'help' };

/**
 * Parses the arguments of `scripts/indexnow.mjs`. Unknown options throw instead of being ignored, so a typo such as
 * `--dryrun` can never turn a rehearsal into a real submission; `--` ends option parsing. Site-relative paths are
 * expanded to absolute URLs.
 * @param {readonly string[]} argv
 * @returns {{ help: boolean, dryRun: boolean, urls: string[] }}
 */
export function parseIndexNowArgs(argv) {
    /** @type {{ help: boolean, dryRun: boolean, urls: string[] }} */
    const result = { help: false, dryRun: false, urls: [] };
    let optionsEnded = false;

    for (const arg of argv) {
        if (optionsEnded || !arg.startsWith('-')) {
            result.urls.push(arg.startsWith('/') ? `${SITE_URL}${arg}` : arg);
        } else if (arg === '--') {
            optionsEnded = true;
        } else {
            const option = CLI_OPTIONS[arg];
            if (!option) throw new Error(`Unknown option: ${arg}. Run with --help for usage.`);
            result[option] = true;
        }
    }

    return result;
}
