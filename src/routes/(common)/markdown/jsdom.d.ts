// jsdom ships without type declarations; only the surface used by the Markdown renderer and its tests is declared here.
declare module 'jsdom' {
    export class JSDOM {
        constructor(html?: string);
        readonly window: { readonly document: Document };
    }
}
