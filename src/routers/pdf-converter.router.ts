import { Hono } from "hono";
import {
  convertPdfController,
  convertPdfWithOptionsController,
} from "../controllers/pdf-converter.controller";

/**
 * PDF converter router
 * Handles all PDF to HTML conversion endpoints
 */
export const pdfConverterRouter = new Hono();

/**
 * POST /convert
 * Convert PDF to HTML with default options
 * Body: multipart/form-data with 'file' field
 */
pdfConverterRouter.post("/convert", convertPdfController);

/**
 * POST /convert-with-options
 * Convert PDF to HTML with custom options
 * Body: multipart/form-data with 'file' and optional 'options' fields
 * Options should be a JSON string of pdf2htmlEX options
 * Example options: {"zoom": "1.5", "fit-width": true}
 */
pdfConverterRouter.post("/convert-with-options", convertPdfWithOptionsController);
