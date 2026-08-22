// @ts-check
/**
 * Regular expressions for Vercel `has`/`missing` route conditions that approximate RFC 9110 Accept negotiation
 * without any runtime function. They are anchored and free of lookarounds, so they behave the same in Vercel's
 * PCRE matcher and in JavaScript, where `routeDecision()` evaluates them exactly as the routes do (for tests).
 *
 * Honored: q-values in any parameter position, `q=0` exclusions, wildcard ranges, `text/html` (or a wildcard) at
 * q=1 beating fractional `text/markdown`, and a first-decimal-digit comparison when both carry fractional q-values.
 * Approximated: finer quality differences (`0.95` vs `0.9`) tie, and a tie goes to an explicit `text/markdown`.
 * `accept-negotiation.js` is the exact reference implementation the tests compare against.
 */

const WS = '\\s*';
/** Media types are case-insensitive; inline PCRE flags are not portable to JavaScript, so letters become classes. @param {string} literal */
const ci = (literal) => literal.replace(/[a-z]/g, (letter) => `[${letter}${letter.toUpperCase()}]`);
const HTML_RANGE = `(?:${ci('text/html')}|${ci('text')}/\\*|\\*/\\*|${ci('application/xhtml')}\\+${ci('xml')})`;
const MARKDOWN_RANGE = ci('text/markdown');
const PARAM = '[^;,]*';
const ANY_PARAMS = `(?:${WS};${PARAM})*`;
const Q = `[qQ]${WS}=${WS}`;
/** A parameter that is not a quality parameter at all. */
const NOT_Q_PARAM = `(?:[^qQ\\s;,]${PARAM}|[qQ][^=\\s;,]${PARAM})`;
/** A parameter that is not `q=0`: either not a quality parameter, or a non-zero quality. */
const NOT_Q_ZERO_PARAM = `(?:${NOT_Q_PARAM}|${Q}(?:[^0\\s;,]${PARAM}|0\\.[0-9]*[1-9][0-9]*)${WS})`;

/** @param {string} param */
const params = (param) => `(?:${WS};${WS}(?:${param})?)*`;
/** `range` whose parameters never include `q=0`, i.e. the representation is acceptable. @param {string} range */
const acceptable = (range) => `${range}${params(NOT_Q_ZERO_PARAM)}`;
/** `range` with quality 1: no q parameter, `q=1`, or `q=1.0`. @param {string} range */
const topQuality = (range) => `${range}${params(`${NOT_Q_PARAM}|${Q}1(?:\\.0+)?${WS}`)}`;
/** `range` with a fractional quality whose first decimal digit is in `digits` (a character-class body). @param {string} range @param {string} digits */
const fractional = (range, digits) => `${range}${ANY_PARAMS}${WS};${WS}${Q}0\\.[${digits}][0-9]*${WS}${ANY_PARAMS}`;

/** The header lists `item` as one comma-separated entry. @param {string} item */
const contains = (item) => `^(?:[^,]*,)*${WS}${item}${WS}(?:,.*)?$`;
/** `first` and `second` are whole entries, in that order. @param {string} first @param {string} second */
const before = (first, second) => `(?:[^,]*,)*${WS}${first}${WS},(?:[^,]*,)*${WS}${second}${WS}(?:,.*)?`;
/** @param {string} a @param {string} b */
const eitherOrder = (a, b) => [before(a, b), before(b, a)];

const htmlBeatsMarkdownAlternatives = [
    ...eitherOrder(topQuality(HTML_RANGE), fractional(MARKDOWN_RANGE, '0-9')),
    ...[1, 2, 3, 4, 5, 6, 7, 8, 9].flatMap((digit) => eitherOrder(fractional(HTML_RANGE, `${digit}-9`), fractional(MARKDOWN_RANGE, `0-${digit - 1}`)))
];

/** Vercel caps each route condition at 4096 characters (and a route at 16 conditions); stay well under both. */
const CONDITION_BUDGET = 3000;

/**
 * Splits alternatives into anchored alternations that each fit the condition budget. Listing every chunk as a
 * separate `missing` condition keeps the meaning "none of these match".
 * @param {string[]} alternatives
 * @returns {string[]}
 */
function chunkAlternatives(alternatives) {
    /** @type {string[][]} */
    const chunks = [];
    /** @type {string[]} */
    let current = [];
    let size = 0;

    for (const alternative of alternatives) {
        if (current.length > 0 && size + alternative.length + 1 > CONDITION_BUDGET) {
            chunks.push(current);
            current = [];
            size = 0;
        }
        current.push(alternative);
        size += alternative.length + 1;
    }
    if (current.length > 0) chunks.push(current);

    return chunks.map((chunk) => `^(?:${chunk.join('|')})$`);
}

export const acceptPatterns = {
    /** The header has a value (an empty `Accept:` means "no constraint", not "nothing acceptable"). */
    nonEmpty: `^${WS}\\S.*$`,
    /** Some HTML-capable range (`text/html`, `text/` wildcard, full wildcard, `application/xhtml+xml`) is listed without `q=0`. */
    htmlAcceptable: contains(acceptable(HTML_RANGE)),
    /** `text/markdown` is listed explicitly without `q=0`. */
    markdownAcceptable: contains(acceptable(MARKDOWN_RANGE)),
    /** An HTML-capable range outranks `text/markdown`: q=1 against a fractional q, or a higher first decimal digit. Use every entry as a `missing` condition. */
    htmlBeatsMarkdown: chunkAlternatives(htmlBeatsMarkdownAlternatives)
};

/**
 * What the generated routes decide for an Accept header, evaluated in route order:
 * the 406 route, then the Markdown rewrite, then the HTML file on the filesystem.
 * @param {string | null | undefined} accept
 * @returns {'html' | 'markdown' | 'not-acceptable'}
 */
export function routeDecision(accept) {
    if (accept === null || accept === undefined) return 'html';

    /** @param {string} pattern */
    const matches = (pattern) => new RegExp(pattern).test(accept);

    if (matches(acceptPatterns.nonEmpty) && !matches(acceptPatterns.htmlAcceptable) && !matches(acceptPatterns.markdownAcceptable)) {
        return 'not-acceptable';
    }
    if (matches(acceptPatterns.markdownAcceptable) && !acceptPatterns.htmlBeatsMarkdown.some(matches)) return 'markdown';
    return 'html';
}
