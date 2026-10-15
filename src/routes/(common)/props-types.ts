import { readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

export type Prop = { name: string; type: string; optional: boolean; memberOnly: boolean; description: string; default: null };
export type PropsManifest = Record<string, { source: string; props: Prop[] }>;
export type PropsNames = Record<string, ReadonlySet<string>>;

/** Build names first; type/JSDoc serialization is opt-in and never needed by table validation. */
export function createPropsCatalog(root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')) {
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
    const entries = new Map<string, { source: string; node: ts.TypeAliasDeclaration; members: number; props: Map<string, ts.Symbol[]> }>();
    const names: PropsNames = Object.create(null);
    for (const file of files) {
        const source = program.getSourceFile(file);
        if (!source) throw new Error(`Missing type source: ${file}`);
        const errors = [...program.getSyntacticDiagnostics(source), ...program.getSemanticDiagnostics(source)].filter(
            (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error
        );
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
            const members = type.isUnion() ? type.types : [type];
            const props = new Map<string, ts.Symbol[]>();
            for (const member of members) {
                for (const symbol of checker.getPropertiesOfType(member)) {
                    const symbols = props.get(symbol.name) ?? [];
                    symbols.push(symbol);
                    props.set(symbol.name, symbols);
                }
            }
            if (!props.size) throw new Error(`No resolved properties: ${node.name.text}`);
            if (entries.has(node.name.text)) throw new Error(`Duplicate type: ${node.name.text}`);
            entries.set(node.name.text, { source: relative(root, file).split('\\').join('/'), node, members: members.length, props });
            names[node.name.text] = new Set(props.keys());
        }
    }
    return {
        names,
        /** Serialize all types for the CLI, or selected types for focused experiment tests. */
        manifest(typeNames: readonly string[] = [...entries.keys()]): PropsManifest {
            const manifest: PropsManifest = {};
            for (const name of typeNames) {
                const entry = entries.get(name);
                if (!entry) throw new Error(`Unknown props type: ${name}`);
                const props = [...entry.props]
                    .map(([propName, symbols]): Prop => {
                        const types = [
                            ...new Set(
                                symbols.map((symbol) =>
                                    checker.typeToString(
                                        checker.getTypeOfSymbolAtLocation(symbol, entry.node),
                                        entry.node,
                                        ts.TypeFormatFlags.NoTruncation
                                    )
                                )
                            )
                        ];
                        const memberOnly = symbols.length < entry.members;
                        return {
                            name: propName,
                            type: types.length === 1 ? types[0]! : types.map((type) => `(${type})`).join(' | '),
                            optional: memberOnly || symbols.some((symbol) => Boolean(symbol.flags & ts.SymbolFlags.Optional)),
                            memberOnly,
                            description: [...new Set(symbols.map((symbol) => ts.displayPartsToString(symbol.getDocumentationComment(checker))))]
                                .filter(Boolean)
                                .join('\n\n'),
                            default: null
                        };
                    })
                    .sort((a, b) => a.name.localeCompare(b.name, 'en'));
                manifest[name] = { source: entry.source, props };
            }
            return manifest;
        }
    };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    process.stdout.write(`${JSON.stringify({ experimental: true, defaults: 'not inferred', types: createPropsCatalog().manifest() }, null, 2)}\n`);
}
