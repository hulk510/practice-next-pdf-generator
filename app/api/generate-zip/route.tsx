import PDFDocument from "@/components/PDFDocument";
import { formDataSchema } from "@/types/formData";
import { renderToBuffer } from "@react-pdf/renderer";
import archiver from "archiver";
import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();
    const validatedData = formDataSchema.parse(formData);

    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    const pdfBuffer = await renderToBuffer(
      <PDFDocument formData={validatedData} />,
    );
    archive.append(pdfBuffer, { name: "guideline.pdf" });

    const iconNames = ["1.png", "2.png", "3.png", "4.png"];
    for (const iconName of iconNames) {
      const iconPath = path.resolve(`./public/icons/${iconName}`);
      const iconContent = await fs.readFile(iconPath);
      archive.append(iconContent, { name: `icons/${iconName}` });
    }

    // フォームデータをJSONファイルとして追加
    const formDataJson = JSON.stringify(validatedData, null, 2);
    archive.append(formDataJson, { name: "form-data.json" });

    const chunks: Uint8Array[] = [];
    archive.on("data", (chunk) => chunks.push(chunk));

    await new Promise((resolve, reject) => {
      archive.on("error", reject);
      archive.on("end", resolve);
      archive.finalize();
    });

    const zipBuffer = Buffer.concat(chunks);

    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=guideline-package.zip",
      },
    });
  } catch (error) {
    console.error("Error generating ZIP:", error);
    return NextResponse.json(
      { error: "Failed to generate ZIP file" },
      { status: 500 },
    );
  }
}
