import { FormData, formDataSchema } from "../types/formData";

export class FormDataService {
  static exportJSON(data: FormData): string {
    return JSON.stringify(data, null, 2);
  }

  static createDownloadLink(jsonString: string, fileName: string): void {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  static importJSON(jsonString: string): FormData {
    try {
      const json = JSON.parse(jsonString);
      return this.validateFormData(json);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Invalid JSON format: ${error.message}`);
      }
      throw new Error("Invalid JSON format. Please check your file.");
    }
  }

  static validateFormData(data: unknown): FormData {
    const validationResult = formDataSchema.safeParse(data);
    if (validationResult.success) {
      return validationResult.data;
    } else {
      throw new Error("Invalid form data. Please check your input.");
    }
  }
}
