// @ts-check
/**
 * RFC 9110 §12.5.1 content negotiation between the two representations this site serves: HTML (the default) and Markdown.
 * Self-contained on purpose: it runs inside the Vercel middleware (edge runtime) as well as in tests.
 */

/** @typedef {{ type: string, subtype: string, q: number }} MediaRange */

/**
 * Parses an Accept header into media ranges with quality values. Malformed entries are skipped, parameters other
 * than `q` are ignored, and `q` is clamped to [0, 1] (defaulting to 1 when it is missing or unparsable).
 * @param {string | null | undefined} header
 * @returns {MediaRange[]}
 */
export function parseAccept(header) {
    if (!header) return [];

    /** @type {MediaRange[]} */
    const ranges = [];

    for (const entry of header.split(',')) {
        const [range = '', ...params] = entry.split(';');
        const [type, subtype] = range.trim().toLowerCase().split('/');
        if (!type || !subtype) continue;

        let q = 1;
        for (const param of params) {
            const [name, value] = param.split('=');
            if (name?.trim().toLowerCase() !== 'q') continue;
            const parsed = Number.parseFloat(value ?? '');
            q = Number.isNaN(parsed) ? 1 : Math.min(1, Math.max(0, parsed));
        }

        ranges.push({ type, subtype, q });
    }

    return ranges;
}

const EXACT = 3;
const SUBTYPE_WILDCARD = 2;
const WILDCARD = 1;

/**
 * Quality and specificity of the most specific range matching a media type; `q` is 0 when nothing matches.
 * @param {MediaRange[]} ranges
 * @param {string} type
 * @param {string} subtype
 * @returns {{ q: number, specificity: number }}
 */
function match(ranges, type, subtype) {
    let best = { q: 0, specificity: 0 };

    for (const range of ranges) {
        let specificity = 0;
        if (range.type === type && range.subtype === subtype) specificity = EXACT;
        else if (range.type === type && range.subtype === '*') specificity = SUBTYPE_WILDCARD;
        else if (range.type === '*' && range.subtype === '*') specificity = WILDCARD;

        if (specificity === 0) continue;
        if (specificity > best.specificity || (specificity === best.specificity && range.q > best.q)) {
            best = { q: range.q, specificity };
        }
    }

    return best;
}

/**
 * Decides which representation to serve. HTML is the default: wildcards resolve to it and it wins whenever its quality
 * is at least Markdown's, except that an explicit `text/markdown` range wins a tie. A `q=0` range excludes its
 * representation, and when neither representation is acceptable the answer is 406.
 * @param {string | null | undefined} accept
 * @returns {'html' | 'markdown' | 'not-acceptable'}
 */
export function negotiate(accept) {
    const ranges = parseAccept(accept);
    if (ranges.length === 0) return 'html';

    const html = match(ranges, 'text', 'html');
    const xhtml = match(ranges, 'application', 'xhtml+xml');
    const bestHtml = xhtml.q > html.q ? xhtml : html;
    const markdown = match(ranges, 'text', 'markdown');

    if (bestHtml.q === 0 && markdown.q === 0) return 'not-acceptable';
    if (markdown.q > bestHtml.q) return 'markdown';
    if (markdown.q === bestHtml.q && markdown.specificity === EXACT) return 'markdown';
    return 'html';
}
