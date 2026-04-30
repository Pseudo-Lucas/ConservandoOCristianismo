import { useCallback, useRef, useState } from 'react'

export default function AdminRichTextEditor({ initialContent = '', onChange }) {
  const editorRef = useRef(null)
  const [showPreview, setShowPreview] = useState(false)
  const [previewHtml, setPreviewHtml] = useState('')

  const triggerChange = useCallback(() => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  const execCmd = useCallback((command, value = null) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    triggerChange()
  }, [triggerChange])

  const handleInsertLink = () => {
    const url = prompt('URL do link:')
    if (url) execCmd('createLink', url)
  }

  const handleInsertImage = () => {
    const url = prompt('URL da imagem:')
    if (url) execCmd('insertImage', url)
  }

  const handleHeading = (tag) => {
    execCmd('formatBlock', tag)
  }

  const handleCodeBlock = () => {
    const selection = window.getSelection()
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const pre = document.createElement('pre')
      const code = document.createElement('code')
      code.textContent = selection.toString()
      pre.appendChild(code)
      range.deleteContents()
      range.insertNode(pre)
      triggerChange()
    }
  }

  const togglePreview = () => {
    if (!showPreview) {
      setPreviewHtml(editorRef.current?.innerHTML || '')
    }
    setShowPreview(!showPreview)
  }

  const toolbarGroups = [
    {
      label: 'Histórico',
      buttons: [
        { label: '↩', command: 'undo', title: 'Desfazer' },
        { label: '↪', command: 'redo', title: 'Refazer' },
      ],
    },
    {
      label: 'Texto',
      buttons: [
        { label: 'B', command: 'bold', title: 'Negrito', style: { fontWeight: 'bold' } },
        { label: 'I', command: 'italic', title: 'Itálico', style: { fontStyle: 'italic' } },
        { label: 'U', command: 'underline', title: 'Sublinhado', style: { textDecoration: 'underline' } },
        { label: 'S', command: 'strikeThrough', title: 'Riscado', style: { textDecoration: 'line-through' } },
      ],
    },
    {
      label: 'Blocos',
      buttons: [
        { label: 'H2', command: 'heading', value: 'h2', title: 'Título 2' },
        { label: 'H3', command: 'heading', value: 'h3', title: 'Título 3' },
        { label: 'H4', command: 'heading', value: 'h4', title: 'Título 4' },
        { label: '¶', command: 'formatBlock', value: 'p', title: 'Parágrafo' },
        { label: '❝', command: 'formatBlock', value: 'blockquote', title: 'Citação' },
        { label: '</>', command: 'codeBlock', title: 'Bloco de código' },
      ],
    },
    {
      label: 'Listas',
      buttons: [
        { label: '• Lista', command: 'insertUnorderedList', title: 'Lista com marcadores' },
        { label: '1. Lista', command: 'insertOrderedList', title: 'Lista numerada' },
      ],
    },
    {
      label: 'Alinhamento',
      buttons: [
        { label: '⫷', command: 'justifyLeft', title: 'Alinhar à esquerda' },
        { label: '⫿', command: 'justifyCenter', title: 'Centralizar' },
        { label: '⫸', command: 'justifyRight', title: 'Alinhar à direita' },
      ],
    },
    {
      label: 'Inserir',
      buttons: [
        { label: 'Link', command: 'link', title: 'Inserir link' },
        { label: 'Imagem', command: 'image', title: 'Inserir imagem por URL' },
      ],
    },
    {
      label: 'Limpar',
      buttons: [
        { label: 'Limpar', command: 'removeFormat', title: 'Limpar formatação' },
      ],
    },
  ]

  const handleToolbarClick = (btn) => {
    if (btn.command === 'link') {
      handleInsertLink()
    } else if (btn.command === 'image') {
      handleInsertImage()
    } else if (btn.command === 'heading') {
      handleHeading(btn.value)
    } else if (btn.command === 'codeBlock') {
      handleCodeBlock()
    } else if (btn.command === 'formatBlock') {
      execCmd('formatBlock', btn.value)
    } else {
      execCmd(btn.command, btn.value || null)
    }
  }

  return (
    <div className="admin-rte-container">
      <div className="admin-rte-toolbar">
        {toolbarGroups.map((group, gi) => (
          <div className="admin-rte-toolbar-group" key={gi}>
            {group.buttons.map((btn) => (
              <button
                key={btn.command + (btn.value || '')}
                type="button"
                title={btn.title}
                style={btn.style || {}}
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleToolbarClick(btn)
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        ))}
        <div className="admin-rte-toolbar-group" style={{ marginLeft: 'auto' }}>
          <button
            type="button"
            title={showPreview ? 'Editar' : 'Pré-visualizar'}
            className={showPreview ? 'active' : ''}
            onMouseDown={(e) => {
              e.preventDefault()
              togglePreview()
            }}
          >
            {showPreview ? '✎ Editar' : '👁 Preview'}
          </button>
        </div>
      </div>

      {showPreview ? (
        <div
          className="admin-rte-preview article-body"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      ) : (
        <div
          className="admin-rte-editor"
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-label="Conteúdo do artigo"
          dangerouslySetInnerHTML={{ __html: initialContent }}
          onInput={triggerChange}
          onBlur={triggerChange}
        />
      )}
    </div>
  )
}
