import visit from 'unist-util-visit';

type OptionString = string | undefined

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

export const transform = (tree: any) => {

  const visitor = (node: any) => {
    const { children } = node;

    if (children.length >= 1 && children[0].value.startsWith('CODE_INCLUDE')) {

      let cb = new CodeBlock(
        /* lang = */ 'js',
        /* code = */['const a = 1', 'const b = 2'],
        /* title */ "Foo"
      )

      cb.createNode(node)
    }

  }

  visit(tree, 'paragraph', visitor)
};