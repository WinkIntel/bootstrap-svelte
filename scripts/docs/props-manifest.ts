import { readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

export type Prop = { name: string; type: string; optional: boolean; description: string; default: null };
export type PropsManifest = Record<string, { source: string; props: Prop[] }>;

/** Experimental, build-time only. Runtime defaults cannot be inferred from a type alias. */
export function createPropsManifest(root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')): PropsManifest {
    const configPath = join(root, 'tsconfig.json');
    const config = ts.readConfigFile(configPath, ts.sys.readFile);
    if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\n'));
    const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
    if (parsed.errors.length)
        throw new Error(
            ts.formatDiagnosticsWithColorAndContext(parsed.errors, {
                getCanonicalFileName: (file) => file,
                getCurrentDirectory: () => root,
                getNewLine: () => '\n'
            })
        );
    const files = readdirSync(join(root, 'src/lib'), { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && ts.sys.fileExists(join(root, 'src/lib', entry.name, 'types.ts')))
        .map((entry) => join(root, 'src/lib', entry.name, 'types.ts'))
        .sort();
    const program = ts.createProgram([...files, ...parsed.fileNames.filter((file) => file.endsWith('.d.ts'))], { ...parsed.options, noEmit: true });
    const checker = program.getTypeChecker();
    const manifest: PropsManifest = {};
    for (const file of files) {
        const source = program.getSourceFile(file);
        if (!source) throw new Error(`Missing type source: ${file}`);
        const errors = program.getSemanticDiagnostics(source).filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
        if (errors.length) throw new Error(errors.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')).join('\n'));
        for (const node of source.statements) {
            if (
                !ts.isTypeAliasDeclaration(node) ||
                !/(Props|Options)$/.test(node.name.text) ||
                !node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
            )
                continue;
            const type = checker.getTypeAtLocation(node);
            if (type.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown)) throw new Error(`Unresolved type: ${node.name.text}`);
            const props = checker
                .getPropertiesOfType(type)
                .map((symbol): Prop => ({
                    name: symbol.name,
                    type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, node), node, ts.TypeFormatFlags.NoTruncation),
                    optional: Boolean(symbol.flags & ts.SymbolFlags.Optional),
                    description: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
                    default: null
                }))
                .sort((a, b) => a.name.localeCompare(b.name, 'en'));
            if (!props.length) throw new Error(`No resolved properties: ${node.name.text}`);
            if (manifest[node.name.text]) throw new Error(`Duplicate type: ${node.name.text}`);
            manifest[node.name.text] = { source: relative(root, file).split('\\').join('/'), props };
        }
    }
    return manifest;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    process.stdout.write(`${JSON.stringify({ experimental: true, defaults: 'not inferred', types: createPropsManifest() }, null, 2)}\n`);
}
