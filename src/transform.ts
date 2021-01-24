import visit from 'unist-util-visit';

export const transform = (tree: any) => {

  const visitor = (node: any) => {
    const { children } = node;

    if (children.length >= 1 && children[0].value == 'CODE_INCLUDE') {
      node.type = 'code';
      node.children = undefined;
      node.lang = 'js'
      node.value = `const a = 1`
    }

  }

  visit(tree, 'paragraph', visitor)
};