import { Schema } from 'prosemirror-model'

export type Marks = 'bold' | 'code' | 'italic' | 'link' | 'strikethrough'
export type Nodes =
  | 'blockquote'
  | 'code_block'
  | 'doc'
  | 'hard_break'
  | 'heading'
  | 'horizontal_rule'
  | 'image'
  | 'paragraph'
  | 'text'
  | 'table'
  | 'table_body'
  | 'table_colgroup'
  | 'table_row'
  | 'table_cell'
  | 'table_col'

export type ExampleSchema = Schema<Nodes, Marks>

const getCellAttrs = (p: Node | string) => {
  const dom = p as HTMLTableCellElement

  const celltype = dom.tagName.toLowerCase()
  const colspan = Number(dom.getAttribute('colspan') || 1)

  return {
    celltype,
    colspan,
    rowspan: Number(dom.getAttribute('rowspan') || 1),
    placeholder: dom.getAttribute('data-placeholder-text') || '',
  }
}

export const schema: ExampleSchema = new Schema<Nodes, Marks>({
  nodes: {
    // :: NodeSpec The top level document node.
    doc: {
      content: 'block+',
    },

    // :: NodeSpec A plain paragraph textblock. Represented in the DOM
    // as a `<p>` element.
    paragraph: {
      attrs: { makeMeRed: { default: null } },
      content: 'inline*',
      group: 'block',
      parseDOM: [{ tag: 'p' }],
      toDOM(el) {
        const attrs = {
          style: el.attrs.makeMeRed ? 'background: red;' : undefined
        }
        return ['p', attrs, 0]
      },
    },

    // :: NodeSpec A blockquote (`<blockquote>`) wrapping one or more blocks.
    blockquote: {
      attrs: { makeMeRed: { default: null } },
      content: 'block+',
      group: 'block',
      defining: true,
      parseDOM: [{ tag: 'blockquote' }],
      toDOM(el) {
        const attrs = {
          style: el.attrs.makeMeRed ? 'background: red;' : undefined
        }
        return ['blockquote', attrs, 0]
      },
    },

    // :: NodeSpec A horizontal rule (`<hr>`).
    horizontal_rule: {
      group: 'block',
      parseDOM: [{ tag: 'hr' }],
      toDOM() {
        return ['hr']
      },
    },

    // :: NodeSpec A heading textblock, with a `level` attribute that
    // should hold the number 1 to 6. Parsed and serialized as `<h1>` to
    // `<h6>` elements.
    heading: {
      attrs: { level: { default: 1 } },
      content: 'inline*',
      group: 'block',
      defining: true,
      parseDOM: [
        { tag: 'h1', attrs: { level: 1 } },
        { tag: 'h2', attrs: { level: 2 } },
        { tag: 'h3', attrs: { level: 3 } },
        { tag: 'h4', attrs: { level: 4 } },
        { tag: 'h5', attrs: { level: 5 } },
        { tag: 'h6', attrs: { level: 6 } },
      ],
      toDOM(node) {
        return ['h' + node.attrs.level, 0]
      },
    },

    // :: NodeSpec A code listing. Disallows marks or non-text inline
    // nodes by default. Represented as a `<pre>` element with a
    // `<code>` element inside of it.
    code_block: {
      content: 'text*',
      marks: '',
      group: 'block',
      code: true,
      defining: true,
      parseDOM: [{ tag: 'pre', preserveWhitespace: 'full' }],
      toDOM() {
        return ['pre', ['code', 0]]
      },
    },

    // :: NodeSpec The text node.
    text: {
      group: 'inline',
    },

    // :: NodeSpec An inline image (`<img>`) node. Supports `src`,
    // `alt`, and `href` attributes. The latter two default to the empty
    // string.
    image: {
      inline: true,
      attrs: {
        src: {},
        alt: { default: null },
        title: { default: null },
      },
      group: 'inline',
      draggable: true,
      parseDOM: [
        {
          tag: 'img[src]',
          getAttrs(p) {
            const dom = p as HTMLElement
            return {
              src: dom.getAttribute('src'),
              title: dom.getAttribute('title'),
              alt: dom.getAttribute('alt'),
            }
          },
        },
      ],
      toDOM(node) {
        const { src, alt, title } = node.attrs
        return ['img', { src, alt, title }]
      },
    },

    // :: NodeSpec A hard line break, represented in the DOM as `<br>`.
    hard_break: {
      inline: true,
      group: 'inline',
      selectable: false,
      parseDOM: [{ tag: 'br' }],
      toDOM() {
        return ['br']
      },
    },

    table: {
      content: 'table_colgroup? table_body',
      tableRole: 'table',
      isolating: true,
      group: 'block',
      selectable: false,
      parseDOM: [
        {
          tag: 'table',
        },
      ],
      toDOM: () => {
        return ['table', 0]
      },
    },

    table_body: {
      content: 'table_row{3,}',
      group: 'block',
      tableRole: 'tbody',
      parseDOM: [
        {
          tag: 'tbody',
        },
      ],
      toDOM() {
        return ['tbody', 0]
      },
    },

    table_colgroup: {
      content: 'table_col+',
      group: 'block',
      tableRole: 'colgroup',
      parseDOM: [
        {
          tag: 'colgroup',
        },
      ],
      toDOM() {
        return ['colgroup', 0]
      },
    },

    table_row: {
      content: 'table_cell+',
      tableRole: 'row',
      parseDOM: [
        {
          tag: 'tr',
          priority: 80,
        },
      ],
      toDOM: () => {
        return ['tr', 0]
      },
    },

    table_cell: {
      content: 'inline*',
      attrs: {
        celltype: { default: 'td' },
        colspan: { default: 1 },
        rowspan: { default: 1 },
      },
      tableRole: 'cell',
      isolating: true,
      parseDOM: [
        { tag: 'td', getAttrs: getCellAttrs },
        { tag: 'th', getAttrs: getCellAttrs },
      ],
      toDOM: (node) => {
        const tableCellNode = node
    
        const attrs: { [attr: string]: string } = {}
        const tag = tableCellNode.attrs.celltype
    
        if (tableCellNode.attrs.colspan && tableCellNode.attrs.colspan !== 1) {
          attrs.colspan = String(tableCellNode.attrs.colspan)
        }
    
        if (tableCellNode.attrs.rowspan && tableCellNode.attrs.rowspan !== 1) {
          attrs.rowspan = String(tableCellNode.attrs.rowspan)
        }
    
        return [tag, attrs, 0]
      },
    },
    
    table_col: {
      attrs: {
        width: { default: '' },
      },
      group: 'block',
      tableRole: 'col',
      parseDOM: [
        {
          tag: 'col',
          getAttrs: (p) => {
            const dom = p as HTMLTableColElement
            return {
              width: dom.getAttribute('width'),
            }
          },
        },
      ],
      toDOM: (node) => {
        const tableColNode = node
    
        const attrs: { [key: string]: string } = {}
    
        if (tableColNode.attrs.width) {
          attrs['width'] = tableColNode.attrs.width
        }
    
        return ['col', attrs]
      },
    },
  },
  marks: {
    // :: MarkSpec A link. Has `href` and `title` attributes. `title`
    // defaults to the empty string. Rendered and parsed as an `<a>`
    // element.
    link: {
      attrs: {
        href: {},
        title: { default: null },
      },
      inclusive: false,
      parseDOM: [
        {
          tag: 'a[href]',
          getAttrs(p) {
            const dom = p as HTMLElement
            return {
              href: dom.getAttribute('href'),
              title: dom.getAttribute('title'),
            }
          },
        },
      ],
      toDOM(node) {
        const { href, title } = node.attrs
        return ['a', { href, title }, 0]
      },
    },

    // :: MarkSpec An emphasis mark. Rendered as an `<em>` element.
    // Has parse rules that also match `<i>` and `font-style: italic`.
    italic: {
      parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
      toDOM() {
        return ['em', 0]
      },
    },

    // :: MarkSpec A strong mark. Rendered as `<strong>`, parse rules
    // also match `<b>` and `font-weight: bold`.
    bold: {
      parseDOM: [
        { tag: 'strong' },
        // This works around a Google Docs misbehavior where
        // pasted content will be inexplicably wrapped in `<b>`
        // tags with a font-weight normal.
        {
          tag: 'b',
          getAttrs: (p) => {
            const node = p as HTMLElement
            return node.style.fontWeight != 'normal' && null
          },
        },
        {
          style: 'font-weight',
          getAttrs: (p) => {
            const value = p as string
            return /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null
          },
        },
      ],
      toDOM() {
        return ['strong', 0]
      },
    },

    // :: MarkSpec Code font mark. Represented as a `<code>` element.
    code: {
      parseDOM: [{ tag: 'code' }],
      toDOM() {
        return ['code', 0]
      },
    },

    strikethrough: {
      parseDOM: [
        { tag: 's' },
        { tag: 'strike' },
        { style: 'text-decoration=line-through' },
        { style: 'text-decoration-line=line-through' },
      ],
      toDOM: () => ['s'],
    },
  },
})
