import visit from 'unist-util-visit';
import { fetchCodeFromFile } from './fetchCode';

type OptionString = string | undefined
type OptionCodeBlock = CodeBlock | undefined

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

function extractCodeBlock(options: IncludeOptions, node: any): OptionCodeBlock {
  const { children } = node

  let cb = undefined

  if (children.length >= 1 && children[0].value.startsWith(options.marker)) {
    // Extract codeblock from filesystem 
    if (children.length == 1) {
      let parts = children[0].value.split(" ")

      if (parts.length >= 3) {
        cb = new CodeBlock(
          parts[1],
          fetchCodeFromFile(parts[2]),
          (parts.length == 4) ? parts[3] : undefined
        )
      }
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