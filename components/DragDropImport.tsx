import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface DragDropImportProps {
  onImport: (jsonString: string) => void
}

export function DragDropImport({ onImport }: DragDropImportProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const jsonString = e.target?.result as string
          onImport(jsonString)
        }
        reader.readAsText(file)
      }
    },
    [onImport],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/json': ['.json'] },
    multiple: false,
  })

  return (
    <button
      {...getRootProps()}
      className='border-2 border-dashed border-primary/50 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors'
      tabIndex={0}
      aria-label='JSONファイルをインポート'
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className='text-primary'>ドロップしてJSONファイルをインポート</p>
      ) : (
        <p className='text-muted-foreground'>
          ここにJSONファイルをドラッグ＆ドロップ、またはクリックしてファイルを選択
        </p>
      )}
    </button>
  )
}
