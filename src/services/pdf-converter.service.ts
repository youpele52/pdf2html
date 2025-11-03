import pdfParse from "pdf-parse";

/**
 * Converts a PDF buffer to HTML in memory
 * @param pdfBuffer - ArrayBuffer containing the PDF data
 * @param fileName - Optional filename to display in the HTML title
 * @returns The HTML content as a string
 */
export async function convertPdfToHtmlInMemory(
  pdfBuffer: ArrayBuffer,
  fileName?: string
): Promise<string> {
  try {
    // Parse PDF from buffer
    const data = await pdfParse(Buffer.from(pdfBuffer));

    // Use filename if provided, otherwise use default
    const docTitle = fileName ? fileName.replace(/\.pdf$/i, "") : "PDF Document";

    // Generate HTML
    let htmlContent = `
<html>
  <head>
    <meta charset="utf-8">
    <title>${docTitle}</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; }
      .page { margin: 20px 0; border: 1px solid #ccc; padding: 15px; }
      .page-number { color: #666; font-size: 12px; margin-bottom: 10px; }
      pre { white-space: pre-wrap; word-wrap: break-word; }
    </style>
  </head>
  <body>
    <h1>${docTitle}</h1>
    <p>Pages: ${data.numpages}</p>
`;

    // Add text content from each page
    if (data.text) {
      const pages = data.text.split("\f"); // Form feed character separates pages
      pages.forEach((pageText: string, index: number) => {
        if (pageText.trim()) {
          htmlContent += `
    <div class="page">
      <div class="page-number">Page ${index + 1}</div>
      <pre>${pageText}</pre>
    </div>
`;
        }
      });
    }

    htmlContent += `
  </body>
</html>
`;

    return htmlContent;
  } catch (error) {
    throw new Error(
      `PDF conversion failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Converts a PDF buffer to HTML with custom options in memory
 * @param pdfBuffer - ArrayBuffer containing the PDF data
 * @param options - Additional conversion options (include_metadata, fileName, etc.)
 * @returns The HTML content as a string
 */
export async function convertPdfToHtmlWithOptionsInMemory(
  pdfBuffer: ArrayBuffer,
  options: Record<string, string | number | boolean> = {}
): Promise<string> {
  const includeMetadata = options.include_metadata === true;
  const fileName = options.fileName as string | undefined;

  try {
    // Parse PDF from buffer
    const data = await pdfParse(Buffer.from(pdfBuffer));

    // Use filename if provided, otherwise use default
    const docTitle = fileName ? fileName.replace(/\.pdf$/i, "") : "PDF Document";

    // Generate HTML with options
    let htmlContent = `
<html>
  <head>
    <meta charset="utf-8">
    <title>${docTitle}</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; }
      .metadata { background: #f5f5f5; padding: 10px; margin-bottom: 20px; border-radius: 5px; }
      .page { margin: 20px 0; border: 1px solid #ccc; padding: 15px; }
      .page-number { color: #666; font-size: 12px; margin-bottom: 10px; }
      pre { white-space: pre-wrap; word-wrap: break-word; }
    </style>
  </head>
  <body>
    <h1>${docTitle}</h1>
`;

    // Add metadata if requested
    if (includeMetadata && data.info) {
      htmlContent += `
    <div class="metadata">
      <h2>Document Info</h2>
      <p><strong>Pages:</strong> ${data.numpages}</p>
      <p><strong>Title:</strong> ${data.info.Title || "N/A"}</p>
      <p><strong>Author:</strong> ${data.info.Author || "N/A"}</p>
      <p><strong>Subject:</strong> ${data.info.Subject || "N/A"}</p>
    </div>
`;
    } else {
      htmlContent += `<p>Pages: ${data.numpages}</p>`;
    }

    // Add text content from each page
    if (data.text) {
      const pages = data.text.split("\f"); // Form feed character separates pages
      pages.forEach((pageText: string, index: number) => {
        if (pageText.trim()) {
          htmlContent += `
    <div class="page">
      <div class="page-number">Page ${index + 1}</div>
      <pre>${pageText}</pre>
    </div>
`;
        }
      });
    }

    htmlContent += `
  </body>
</html>
`;

    return htmlContent;
  } catch (error) {
    throw new Error(
      `PDF conversion failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
