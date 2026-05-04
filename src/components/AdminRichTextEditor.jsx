'use client'

import { useCallback, useRef, useState } from 'react'

function cleanHtml(html) {
  const template = document.createElement('template')
  template.innerHTML = html
  template.content.querySelectorAll('script, iframe, object, embed').forEach((node) => node.remove())
  template.content.querySelectorAll('*').forEach((node) => {
    for (const attr of [...node.attributes]) {
      if (attr.name.startsWith('on')) node.removeAttribute(attr.name)
    }
  })
  return template.innerHTML
}

export default function AdminRichTextEditor({ name = 'content', initialContent = '' }) {
  const editorRef = useRef(null)
  const hiddenInputRef = useRef(null)
  const selectedImageRef = useRef(null)
  const [hasSelectedImage, setHasSelectedImage] = useState(false)

  const syncContent = useCallback(() => {
    if (hiddenInputRef.current && editorRef.current) {
      hiddenInputRef.current.value = editorRef.current.innerHTML
    }
  }, [])

  const focusEditor = () => {
    editorRef.current?.focus()
  }

  const execCmd = (command, value = null) => {
    focusEditor()
    document.execCommand(command, false, value)
    syncContent()
  }

  const insertHtml = (html) => {
    focusEditor()
    document.execCommand('insertHTML', false, html)
    syncContent()
  }

  const insertImage = (src) => {
    insertHtml(`<img src="${src}" alt="" style="max-width:100%;height:auto;" />`)
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
    if (event.target?.tagName === 'IMG') {
      selectedImageRef.current = event.target
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

  const handleToolbarMouseDown = (event, action) => {
    event.preventDefault()
    action()
  }

  const groups = [
    [
      ['B', 'Negrito', 'bold'],
      ['I', 'Italico', 'italic'],
      ['U', 'Sublinhado', 'underline'],
      ['S', 'Riscado', 'strikeThrough'],
    ],
    [
      ['H2', 'Titulo 2', 'heading2'],
      ['H3', 'Titulo 3', 'heading3'],
      ['P', 'Paragrafo', 'paragraph'],
      ['"', 'Citacao', 'quote'],
    ],
    [
      ['•', 'Lista', 'insertUnorderedList'],
      ['1.', 'Lista numerada', 'insertOrderedList'],
      ['←', 'Alinhar esquerda', 'justifyLeft'],
      ['↔', 'Centralizar', 'justifyCenter'],
      ['→', 'Alinhar direita', 'justifyRight'],
    ],
    [
      ['Link', 'Inserir link', 'link'],
      ['Imagem', 'Inserir imagem por URL', 'image'],
      ['Limpar', 'Limpar formatacao', 'removeFormat'],
    ],
  ]

  const runToolbarAction = (command) => {
    if (command === 'heading2') return execCmd('formatBlock', 'h2')
    if (command === 'heading3') return execCmd('formatBlock', 'h3')
    if (command === 'paragraph') return execCmd('formatBlock', 'p')
    if (command === 'quote') return execCmd('formatBlock', 'blockquote')
    if (command === 'link') {
      const url = window.prompt('URL do link:')
      if (url) execCmd('createLink', url)
      return undefined
    }
    if (command === 'image') {
      const url = window.prompt('URL da imagem:')
      if (url) insertImage(url)
      return undefined
    }
    return execCmd(command)
  }

  return (
    <div className="admin-rte-container">
      <input ref={hiddenInputRef} type="hidden" name={name} defaultValue={initialContent} />

      <div className="admin-rte-toolbar" aria-label="Ferramentas do editor">
        {groups.map((group, index) => (
          <div className="admin-rte-toolbar-group" key={index}>
            {group.map(([label, title, action]) => (
              <button
                key={title}
                type="button"
                title={title}
                onMouseDown={(event) => handleToolbarMouseDown(event, () => runToolbarAction(action))}
              >
                {label}
              </button>
            ))}
          </div>
        ))}
      </div>

      {hasSelectedImage && (
        <div className="admin-rte-image-tools">
          <span>Imagem</span>
          <button type="button" onMouseDown={(event) => handleToolbarMouseDown(event, () => setImageWidth('25%'))}>25%</button>
          <button type="button" onMouseDown={(event) => handleToolbarMouseDown(event, () => setImageWidth('50%'))}>50%</button>
          <button type="button" onMouseDown={(event) => handleToolbarMouseDown(event, () => setImageWidth('75%'))}>75%</button>
          <button type="button" onMouseDown={(event) => handleToolbarMouseDown(event, () => setImageWidth('100%'))}>100%</button>
          <button type="button" onMouseDown={(event) => handleToolbarMouseDown(event, () => setImageAlign('left'))}>Esq.</button>
          <button type="button" onMouseDown={(event) => handleToolbarMouseDown(event, () => setImageAlign('center'))}>Centro</button>
          <button type="button" onMouseDown={(event) => handleToolbarMouseDown(event, () => setImageAlign('right'))}>Dir.</button>
        </div>
      )}

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
    </div>
  )
}
