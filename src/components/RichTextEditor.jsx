import { useCallback, useRef } from 'react'

export default function RichTextEditor({ editorRef }) {
  const toolbarRef = useRef(null)

  const execCmd = useCallback((command, value = null) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }, [editorRef])

  const handleInsertLink = () => {
    const url = prompt('Insira a URL do link:')
    if (url) {
      execCmd('createLink', url)
    }
  }

  const buttons = [
    { label: 'B', command: 'bold', style: { fontWeight: 'bold' } },
    { label: 'I', command: 'italic', style: { fontStyle: 'italic' } },
    { label: 'U', command: 'underline', style: { textDecoration: 'underline' } },
    { label: '• Lista', command: 'insertUnorderedList', style: {} },
    { label: '1. Lista', command: 'insertOrderedList', style: {} },
    { label: 'Link', command: 'link', style: {} },
    { label: 'Limpar', command: 'removeFormat', style: {} },
  ]

  return (
    <div className="rte-container">
      <div className="rte-toolbar" ref={toolbarRef}>
        {buttons.map((btn) => (
          <button
            key={btn.command}
            type="button"
            style={btn.style}
            title={btn.label}
            onMouseDown={(e) => {
              e.preventDefault()
              if (btn.command === 'link') {
                handleInsertLink()
              } else {
                execCmd(btn.command)
              }
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>
      <div
        className="rte-editor"
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label="Mensagem"
      ></div>
    </div>
  )
}
