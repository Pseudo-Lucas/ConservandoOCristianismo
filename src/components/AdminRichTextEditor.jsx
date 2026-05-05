'use client'

import { useCallback, useRef, useState } from 'react'

const fontFamilies = [
  ['Times New Roman', 'Serifada'],
  ['Georgia', 'Georgia'],
  ['Arial', 'Arial'],
  ['Verdana', 'Verdana'],
  ['Courier New', 'Monospace'],
]

const fontSizes = [
  ['2', 'Pequeno'],
  ['3', 'Normal'],
  ['4', 'Medio'],
  ['5', 'Grande'],
  ['6', 'Maior'],
]

const blockFormats = [
  ['p', 'Normal'],
  ['h2', 'Titulo'],
  ['h3', 'Subtitulo'],
  ['h4', 'Titulo menor'],
  ['blockquote', 'Citacao'],
  ['pre', 'Codigo'],
]

const textColors = ['#000000', '#4a4a4a', '#7B0009', '#8a5a00', '#1f5f2c', '#1f4f7a', '#ffffff']
const bgColors = ['#ffffff', '#f5f5f0', '#f2e8e8', '#fff3cd', '#e8f2ea', '#e8eef5', '#000000']

function escapeAttribute(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')
}

function safeUrl(value) {
  const url = String(value || '').trim()
  if (!url) return ''
  if (/^(https?:|mailto:|tel:|data:image\/)/i.test(url)) return url
  if (url.startsWith('/')) return url
  return ''
}

function cleanHtml(html) {
  const template = document.createElement('template')
  template.innerHTML = html
  template.content.querySelectorAll('script, iframe, object, embed').forEach((node) => node.remove())
  template.content.querySelectorAll('a').forEach((node) => {
    const image = node.querySelector('img')
    if (image && node.textContent.trim() === '') {
      node.replaceWith(image)
    }
  })
  template.content.querySelectorAll('*').forEach((node) => {
    for (const attr of [...node.attributes]) {
      if (attr.name.startsWith('on')) node.removeAttribute(attr.name)
      if ((attr.name === 'href' || attr.name === 'src') && !safeUrl(attr.value)) {
        node.removeAttribute(attr.name)
      }
    }
  })
  return template.innerHTML
}

export default function AdminRichTextEditor({ name = 'content', initialContent = '' }) {
  const editorRef = useRef(null)
  const hiddenInputRef = useRef(null)
  const selectedImageRef = useRef(null)
  const [hasSelectedImage, setHasSelectedImage] = useState(false)
  const [sourceMode, setSourceMode] = useState(false)
  const [sourceHtml, setSourceHtml] = useState(initialContent)

  const syncContent = useCallback(() => {
    if (!hiddenInputRef.current) return
    const html = sourceMode ? sourceHtml : editorRef.current?.innerHTML || ''
    hiddenInputRef.current.value = html
  }, [sourceHtml, sourceMode])

  const focusEditor = () => {
    editorRef.current?.focus()
  }

  const execCmd = (command, value = null) => {
    if (sourceMode) return
    focusEditor()
    document.execCommand(command, false, value)
    syncContent()
  }

  const insertHtml = (html) => {
    if (sourceMode) return
    focusEditor()
    document.execCommand('insertHTML', false, html)
    syncContent()
  }

  const insertImage = (src) => {
    const url = safeUrl(src)
    if (!url) return
    insertHtml(`<img src="${escapeAttribute(url)}" alt="" style="max-width:100%;height:auto;" />`)
  }

  const toggleSourceMode = () => {
    if (sourceMode) {
      if (editorRef.current) editorRef.current.innerHTML = sourceHtml
      if (hiddenInputRef.current) hiddenInputRef.current.value = sourceHtml
      setSourceMode(false)
      return
    }

    const html = editorRef.current?.innerHTML || ''
    setSourceHtml(html)
    if (hiddenInputRef.current) hiddenInputRef.current.value = html
    setSourceMode(true)
  }

  const handlePaste = (event) => {
    const imageItem = [...event.clipboardData.items].find((item) => item.type.startsWith('image/'))

    if (imageItem) {
      event.preventDefault()
      const file = imageItem.getAsFile()
      const reader = new FileReader()
      reader.onload = () => insertImage(reader.result)
      reader.readAsDataURL(file)
      return
    }

    const html = event.clipboardData.getData('text/html')
    if (html) {
      event.preventDefault()
      insertHtml(cleanHtml(html))
    }
  }

  const handleEditorClick = (event) => {
    const target = event.target instanceof Element ? event.target : null
    const image = target?.closest('img')
    const link = target?.closest('a')

    if (link) {
      event.preventDefault()
    }

    if (image) {
      event.preventDefault()
      selectedImageRef.current = image
      setHasSelectedImage(true)
      return
    }
    selectedImageRef.current = null
    setHasSelectedImage(false)
  }

  const setImageWidth = (width) => {
    const image = selectedImageRef.current
    if (!image) return
    image.style.width = width
    image.style.height = 'auto'
    image.style.maxWidth = '100%'
    syncContent()
  }

  const setImageAlign = (align) => {
    const image = selectedImageRef.current
    if (!image) return
    image.style.display = 'block'
    image.style.marginLeft = align === 'center' || align === 'right' ? 'auto' : '0'
    image.style.marginRight = align === 'center' || align === 'left' ? 'auto' : '0'
    syncContent()
  }

  const setCustomImageWidth = () => {
    const width = window.prompt('Largura da imagem. Ex: 420px, 60% ou auto')
    if (!width) return
    setImageWidth(width)
  }

  const removeImageLink = () => {
    const image = selectedImageRef.current
    const link = image?.closest('a')
    if (!image || !link) return
    link.replaceWith(image)
    selectedImageRef.current = image
    syncContent()
  }

  const removeSelectedImage = () => {
    const image = selectedImageRef.current
    if (!image) return
    image.remove()
    selectedImageRef.current = null
    setHasSelectedImage(false)
    syncContent()
  }

  const handleAction = (action) => {
    if (action === 'link') {
      const cleanUrl = safeUrl(window.prompt('URL do link:'))
      if (cleanUrl) execCmd('createLink', cleanUrl)
      return
    }
    if (action === 'image') {
      insertImage(window.prompt('URL da imagem:'))
      return
    }
    if (action === 'video') {
      const cleanUrl = safeUrl(window.prompt('URL/embed do video:'))
      if (cleanUrl) insertHtml(`<p><a href="${escapeAttribute(cleanUrl)}">${cleanUrl}</a></p>`)
      return
    }
    if (action === 'emoji') {
      insertHtml(':-)')
      return
    }
    if (action === 'quote') {
      execCmd('formatBlock', 'blockquote')
      return
    }
    if (action === 'hr') {
      insertHtml('<hr />')
      return
    }
    if (action === 'html') {
      toggleSourceMode()
      return
    }
    execCmd(action)
  }

  const handleMouseDown = (event, action) => {
    event.preventDefault()
    handleAction(action)
  }

  const handleSourceChange = (event) => {
    setSourceHtml(event.target.value)
    if (hiddenInputRef.current) hiddenInputRef.current.value = event.target.value
  }

  const buttons = [
    ['Undo', 'Desfazer', 'undo'],
    ['Redo', 'Refazer', 'redo'],
    ['B', 'Negrito', 'bold'],
    ['I', 'Italico', 'italic'],
    ['U', 'Sublinhado', 'underline'],
    ['S', 'Riscado', 'strikeThrough'],
    ['A', 'Limpar formatacao', 'removeFormat'],
    ['Link', 'Link', 'link'],
    ['Unlink', 'Remover link', 'unlink'],
    ['Img', 'Imagem', 'image'],
    ['Media', 'Video/link de midia', 'video'],
    [':)', 'Emoji', 'emoji'],
    ['Esq', 'Alinhar esquerda', 'justifyLeft'],
    ['Centro', 'Centralizar', 'justifyCenter'],
    ['Dir', 'Alinhar direita', 'justifyRight'],
    ['Just', 'Justificar', 'justifyFull'],
    ['Lista', 'Lista', 'insertUnorderedList'],
    ['1.', 'Lista numerada', 'insertOrderedList'],
    ['- recuo', 'Diminuir recuo', 'outdent'],
    ['+ recuo', 'Aumentar recuo', 'indent'],
    ['"', 'Citacao', 'quote'],
    ['Linha', 'Linha horizontal', 'hr'],
    ['HTML', 'Editar HTML', 'html'],
  ]

  return (
    <div className="admin-rte-container">
      <input ref={hiddenInputRef} type="hidden" name={name} defaultValue={initialContent} />

      <div className="admin-rte-toolbar" aria-label="Ferramentas do editor">
        <div className="admin-rte-toolbar-group admin-rte-select-group">
          <select
            aria-label="Fonte"
            defaultValue="Times New Roman"
            onChange={(event) => execCmd('fontName', event.target.value)}
            disabled={sourceMode}
          >
            {fontFamilies.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <select
            aria-label="Tamanho"
            defaultValue="3"
            onChange={(event) => execCmd('fontSize', event.target.value)}
            disabled={sourceMode}
          >
            {fontSizes.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <select
            aria-label="Formato"
            defaultValue="p"
            onChange={(event) => execCmd('formatBlock', event.target.value)}
            disabled={sourceMode}
          >
            {blockFormats.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="admin-rte-toolbar-group admin-rte-button-group">
          {buttons.map(([label, title, action]) => (
            <button
              key={`${title}-${action}`}
              type="button"
              title={title}
              className={action === 'html' && sourceMode ? 'active' : ''}
              onMouseDown={(event) => handleMouseDown(event, action)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="admin-rte-toolbar-group admin-rte-color-group">
          <label className="admin-rte-color" title="Cor do texto">
            A
            <input type="color" list="text-colors" onChange={(event) => execCmd('foreColor', event.target.value)} disabled={sourceMode} />
          </label>
          <label className="admin-rte-color" title="Cor de fundo">
            Bg
            <input type="color" list="bg-colors" onChange={(event) => execCmd('hiliteColor', event.target.value)} disabled={sourceMode} />
          </label>
          <datalist id="text-colors">
            {textColors.map((color) => <option key={color} value={color} />)}
          </datalist>
          <datalist id="bg-colors">
            {bgColors.map((color) => <option key={color} value={color} />)}
          </datalist>
        </div>
      </div>

      {hasSelectedImage && !sourceMode && (
        <div className="admin-rte-image-tools">
          <span>Imagem</span>
          <button type="button" onMouseDown={(event) => { event.preventDefault(); setImageWidth('25%') }}>25%</button>
          <button type="button" onMouseDown={(event) => { event.preventDefault(); setImageWidth('50%') }}>50%</button>
          <button type="button" onMouseDown={(event) => { event.preventDefault(); setImageWidth('75%') }}>75%</button>
          <button type="button" onMouseDown={(event) => { event.preventDefault(); setImageWidth('100%') }}>100%</button>
          <button type="button" onMouseDown={(event) => { event.preventDefault(); setCustomImageWidth() }}>Largura</button>
          <button type="button" onMouseDown={(event) => { event.preventDefault(); setImageWidth('auto') }}>Original</button>
          <button type="button" onMouseDown={(event) => { event.preventDefault(); setImageAlign('left') }}>Esquerda</button>
          <button type="button" onMouseDown={(event) => { event.preventDefault(); setImageAlign('center') }}>Centro</button>
          <button type="button" onMouseDown={(event) => { event.preventDefault(); setImageAlign('right') }}>Direita</button>
          <button type="button" onMouseDown={(event) => { event.preventDefault(); removeImageLink() }}>Remover link</button>
          <button type="button" onMouseDown={(event) => { event.preventDefault(); removeSelectedImage() }}>Remover</button>
        </div>
      )}

      {sourceMode ? (
        <textarea
          className="admin-rte-source"
          value={sourceHtml}
          onChange={handleSourceChange}
          spellCheck={false}
        />
      ) : (
        <div
          ref={editorRef}
          className="admin-rte-editor"
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-label="Conteudo do artigo"
          dangerouslySetInnerHTML={{ __html: initialContent }}
          onInput={syncContent}
          onBlur={syncContent}
          onPaste={handlePaste}
          onClick={handleEditorClick}
        />
      )}
    </div>
  )
}
