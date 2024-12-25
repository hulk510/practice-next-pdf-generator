import { type FormData, formDataSchema } from '../types/formData'

// JSONデータをエクスポートする関数
export function exportJSON(data: FormData): string {
  return JSON.stringify(data, null, 2)
}

// ダウンロードリンクを作成する関数
export function createDownloadLink(jsonString: string, fileName: string): void {
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)
}

// JSONデータをインポートする関数
export function importJSON(jsonString: string): FormData {
  try {
    const json = JSON.parse(jsonString)
    return validateFormData(json)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Invalid JSON format: ${error.message}`)
    }
    throw new Error('Invalid JSON format. Please check your file.')
  }
}

// フォームデータを検証する関数
export function validateFormData(data: unknown): FormData {
  const validationResult = formDataSchema.safeParse(data)
  if (validationResult.success) {
    return validationResult.data
  }
  throw new Error('Invalid form data. Please check your input.')
}
