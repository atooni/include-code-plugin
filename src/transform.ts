import visit from 'unist-util-visit';
import { fetchCodeFromFile, fetchCodeFromUrl } from './fetchCode';

type OptionString = string | undefined
type OptionCodeBlock = CodeBlock | undefined

function get<V>(v: (V | undefined)): V {
  if (v === undefined) {
    throw new Error("Mandatory variable is not defined")
  } else {
    return v
  }
}

export interface IncludeOptions {
  marker: string;
}

// A code block that needs to be inserted into the md document.
class CodeBlock {
  constructor(
    readonly node: any,
    readonly fromUrl: boolean,
    readonly lang: string,
    readonly codeRef: string,
    readonly title: OptionString
  ) { }

  createNode = async () => {
    this.node.type = 'code';
    this.node.children = undefined;
    this.node.lang = this.lang;
    if (typeof this.title !== "undefined") this.node.meta = 'title="' + this.title + '"';

    const code = this.fromUrl ? (await fetchCodeFromUrl(this.codeRef)) : fetchCodeFromFile(this.codeRef);

    this.node.value = code.reduce((a, b) => a + "\n" + b)
  }
}

// Take a string and extract a simple named parameter
export function extractParam(name: string, input: string): OptionString {
  const regExp = /([a-z]+)=\"([^\"]+)\"/g

  var result = undefined
  var elem;
  while ((result == undefined) && (elem = regExp.exec(input)) !== null) {
    if (elem[1] == name) result = elem[2]
  }

  return result;
}

const applyCodeBlock = (options: IncludeOptions, node: any) => {
  const { children } = node

  let cb = undefined

  if (children.length >= 1 && children[0].value.startsWith(options.marker)) {
    // Extract codeblock from filesystem 
    if (children.length == 1) {
      try {
        const lang = get(extractParam("lang", children[0].value))
        const file = get(extractParam("file", children[0].value))
        const title = extractParam("title", children[0].value)

        cb = new CodeBlock(
          node,
          false,
          lang,
          file,
          title
        )
      } catch (e) {
        console.log("Unable to resolve [" + children[0].value + "]")
      }
    } else if (children.length >= 2) {
      var srcLink: OptionString = undefined
      var text = ""
      for (var c of children) {
        if (c.type == 'link' && srcLink === undefined) srcLink = c.url
        if (c.type == 'text') text = text + c.value + " "
      }

      const lang = get(extractParam("lang", text));
      const title = extractParam("title", text);

      cb = new CodeBlock(
        node,
        true,
        lang,
        get(srcLink),
        title
      )
      // Extract code block from url
    }
  }

  return cb;
}

export const transform = (options: IncludeOptions) => (tree: any) => new Promise<void>(async (resolve) => {

  const nodesToChange: CodeBlock[] = [];

  const visitor = (node: any) => {
    const cb = applyCodeBlock(options, node);
    if (cb !== undefined) {
      nodesToChange.push(cb)
    }
  };

  visit(tree, 'paragraph', visitor);

  for (const cb of nodesToChange) {
    await cb.createNode()
  }

  resolve();
});