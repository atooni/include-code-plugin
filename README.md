## Include Code Plugin 

The `blended-include-code-plugin` is a plugin for [remark](https://github.com/remarkjs/remark) which allows the user to reference code from either the local file system or an arbitrary public url. 

The include command will be replaced with a `code` block with the appropriate attributes. The content of the code
block will be copied into the final markdown, so that the generated site does not require access to the referenced url or file. 

## Installation

The include code plugin is normally used in the context of a site generator using the remark markdown processor underneath. For example, to use the plugin within [Docusaurus 2](https://v2.docusaurus.io/), 

1. Include `blended-include-code-plugin": "0.1.0"` in the _package.json_ of the docusaurus website project. 
1. Within _docusaurus.config.js, configure the include code plugin with a marker for the sections of the site where code shall be included:

   ```
    presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          remarkPlugins: [
            [require('blended-include-code-plugin'), { marker: 'CODE_INCLUDE' }]
          ],
        },
        blog: {
          showReadingTime: false,
          remarkPlugins: [
            [require('blended-include-code-plugin'), { marker: 'CODE_INCLUDE' }]
          ],
        },
        theme: {
          customCss: [
            require.resolve('./src/css/custom.css'),
            //require.resolve('./node_modules/prism-themes/themes/prism-cb.css')
          ],
        },
      },
    ],
  ]
   ```

## Usage

The include will be triggered by a paragraph that begins with the `marker` as configured in the plugin options. after the marker, foremost the reference to the code block must be given as a parameter. Normally, we would also use the `lang` attribute to trigger proper syntax highlighting.

Note, that the syntax highlighting depends on the highlighter chosen for the generated web site. The plugin simply transform the include paragraph into a markdown code block before the HTML is generated.

### Examples

__Include from an URL__

To include code from a URL with `marker = 'CODE_INCLUDE'`, provide the url to the desired file in the form of a markdown link. The link text will be ignored and only the actual link will be used to get the text of the code block. 

```
CODE_INCLUDE lang="typescript" [src](https://raw.githubusercontent.com/atooni/include-code-plugin/854bf663a8ca5dfd0507b697db8f20c89bea5bbb/src/index.ts)
```

__Include from a file__

To include code from a file, use the `file` attribute within the include paragraph. Relative paths will use the markdown processors current working directory as the root path. 

```
CODE_INCLUDE lang="typescript" file="src/index.ts"
```

__Include by section__

If no further arguments are given, the entire file located at the source will be included in the final markdown. To restrict the included code, the user can the `doctag` attribute and a section name to include only an arbitrary segment of the source file. 

The section name must match what is used in the code. 

```
CODE_INCLUDE lang="typescript" file="src/transform.ts" doctag="extractParam"
```

For file content like 

```
...
// Many lines omitted 

    const code = this.fromUrl ? (await fetchCodeFromUrl(this.codeRef)) : fetchCodeFromFile(this.codeRef);

    this.node.value = this.selectLines(code).reduce((a, b) => a + "\n" + b)
  }
}

// doctag<extractParam>
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
// end:doctag<extractParam>

const applyCodeBlock = (options: IncludeOptions, node: any) => {
  const { children } = node

  let cb = undefined

// Many lines omitted  
...
```

only the lines between 

```
// doctag<extractParam>
```

and 

```
// end:doctag<extractParam>
```

would be included.

__Provide an optional title__

Some code highlighters, such as [prismjs](https://prismjs.com/) used within [Docusaurus 2](https://v2.docusaurus.io/) can display a title given in the meta data of the markdown code block. Such a title can be provided via the code include plugin by using the optional `title` attribute within the include paragraph.

```
CODE_INCLUDE lang="typescript" file="src/index.ts" title="Attacher"
```

## Development 

If required we might add a way to select the included section by a range of line numbers. So far the plugin has been used mainly for project web sites using [Docusaurus 2](https://v2.docusaurus.io/). Therefore introducing sections into the comments is a more flexible way as it is independent from changes that would affect the line numbers.

The code has been realized in typescript follwing this excellent [tutorial](https://www.huy.dev/2018-05-remark-gatsby-plugin-part-1/) ff.

