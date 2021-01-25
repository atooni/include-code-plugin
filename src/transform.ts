import visit from 'unist-util-visit';
import { fetchCodeFromFile } from './fetchCode';

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
    readonly lang: string,
    readonly code: Array<string>,
    readonly title: OptionString
  ) { }

  createNode(node: any): void {
    node.type = 'code';
    node.children = undefined;
    node.lang = this.lang;
    if (typeof this.title !== "undefined") node.meta = 'title="' + this.title + '"';
    node.value = this.code.reduce((a, b) => a + "\n" + b);
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

function extractCodeBlock(options: IncludeOptions, node: any): OptionCodeBlock {
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
          lang,
          fetchCodeFromFile(file),
          title
        )
      } catch (e) {
        console.log("Unable to resolve [" + children[0].value + "]")
      }
    } else if (children.length == 3) {
      // Extract code block from url
    } else {

    }
  }

  return cb;
}

export const transform = (options: IncludeOptions) => (tree: any) => {

  const visitor = (node: any) => {

    let codeblock = extractCodeBlock(options, node)

    if (codeblock !== undefined) {
      codeblock.createNode(node)
    }
  }

  visit(tree, 'paragraph', visitor)
};