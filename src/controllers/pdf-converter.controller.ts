import type { Context } from "hono";
import { convertPdfToHtmlInMemory, convertPdfToHtmlWithOptionsInMemory } from "../services/pdf-converter.service";

/**
 * Handles PDF to HTML conversion requests
 * Expects a multipart form with a 'file' field containing the PDF
 * Returns the HTML file as a downloadable attachment
 * No files are saved to disk - everything is processed in memory
 */
export async function convertPdfController(c: Context) {
  try {
    const body = await c.req.formData();
    const file = body.get("file");

    if (!file || !(file instanceof File)) {
      return c.json({ error: "No PDF file provided" }, 400);
    }

    // Read file into memory
    const buffer = await file.arrayBuffer();

    // Convert PDF to HTML in memory
    const htmlContent = await convertPdfToHtmlInMemory(buffer);

    // Generate filename for download
    const originalName = file.name.replace(/\.pdf$/i, "");
    const downloadFilename = `${originalName}.html`;

    // Return HTML as downloadable file
    return c.html(htmlContent, {
      headers: {
        "Content-Disposition": `attachment; filename="${downloadFilename}"`,
      },
    });
  } catch (error) {
    return c.json(
      {
        error: "Conversion failed",
        details: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
}

/**
 * Handles PDF to HTML conversion with custom options
 * Expects a multipart form with 'file' and optional 'options' JSON field
 * Returns the HTML file as a downloadable attachment
 * No files are saved to disk - everything is processed in memory
 */
export async function convertPdfWithOptionsController(c: Context) {
  try {
    const body = await c.req.formData();
    const file = body.get("file");
    const optionsStr = body.get("options");

    if (!file || !(file instanceof File)) {
      return c.json({ error: "No PDF file provided" }, 400);
    }

    // Parse options if provided
    let options: Record<string, string | number | boolean> = {};
    if (optionsStr && typeof optionsStr === "string") {
      try {
        options = JSON.parse(optionsStr);
      } catch {
        return c.json({ error: "Invalid options JSON" }, 400);
      }
    }

    // Read file into memory
    const buffer = await file.arrayBuffer();

    // Convert PDF to HTML with options in memory
    const htmlContent = await convertPdfToHtmlWithOptionsInMemory(buffer, options);

    // Generate filename for download
    const originalName = file.name.replace(/\.pdf$/i, "");
    const downloadFilename = `${originalName}.html`;

    // Return HTML as downloadable file
    return c.html(htmlContent, {
      headers: {
        "Content-Disposition": `attachment; filename="${downloadFilename}"`,
      },
    });
  } catch (error) {
    return c.json(
      {
        error: "Conversion failed",
        details: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
}
