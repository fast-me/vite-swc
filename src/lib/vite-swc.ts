import { JscTarget, Output, ParserConfig, transform } from '@swc/core';
import { SourceMapPayload } from 'module';
import { PluginOption } from 'vite';

export const swc = (entry: string): PluginOption[] => {
  return [
    {
      name: 'vite:swc',
      config: () => ({
        esbuild: false,
        build: {
          ssr: entry,
          rollupOptions: {
            input: entry,
          },
        },
        server: {
          hmr: false,
        },
        optimizeDeps: {
          // Vite does not work well with optionnal dependencies,
          // mark them as ignored for now
          exclude: ['@swc/core'],
        },
      }),
      async transform(code, _id) {
        const id = _id.split('?')[0];

        const result = await transformWithOptions(id, code, 'es2021');
        if (!result) return;

        const sourceMap: SourceMapPayload = JSON.parse(result.map!);
        sourceMap.mappings = ';;;;;;;;' + sourceMap.mappings;
        return { code: result.code, map: sourceMap };
      },
    },
  ];
};

const transformWithOptions = async (
  id: string,
  code: string,
  target: JscTarget
) => {
  const decorators = true;
  const parser: ParserConfig | undefined = id.endsWith('.tsx')
    ? { syntax: 'typescript', tsx: true, decorators }
    : id.endsWith('.ts')
    ? { syntax: 'typescript', tsx: false, decorators }
    : id.endsWith('.jsx')
    ? { syntax: 'ecmascript', jsx: true }
    : id.endsWith('.mdx')
    ? // JSX is required to trigger fast refresh transformations, even if MDX already transforms it
      { syntax: 'ecmascript', jsx: true }
    : undefined;
  if (!parser) return;

  let result: Output;
  try {
    result = await transform(code, {
      filename: id,
      swcrc: false,
      configFile: false,
      sourceMaps: true,
      jsc: {
        target,
        parser,
        transform: {
          useDefineForClassFields: true,
          legacyDecorator: true,
          decoratorMetadata: true,
        },
      },
    });
  } catch (e: any) {
    const message: string = e.message;
    const fileStartIndex = message.indexOf('╭─[');
    if (fileStartIndex !== -1) {
      const match = message.slice(fileStartIndex).match(/:(\d+):(\d+)]/);
      if (match) {
        e.line = match[1];
        e.column = match[2];
      }
    }
    throw e;
  }

  return result;
};

export default swc;
