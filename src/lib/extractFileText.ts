import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const TEXT_FILE_TYPES = new Set([
  "text/plain",
  "text/csv",
  "text/markdown",
  "application/json",
  "application/xml",
  "text/xml",
]);

const getFileExtension = (file: File) =>
  file.name.split(".").pop()?.toLowerCase() || "";

const extractPdfText = async (file: File) => {
  const data = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const pageTexts = await Promise.all(
    Array.from({ length: pdf.numPages }, async (_, index) => {
      const page = await pdf.getPage(index + 1);
      const textContent = await page.getTextContent();
      return textContent.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ");
    }),
  );

  return pageTexts.join("\n\n").trim();
};

const extractWordText = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
};

export const extractFileText = async (file: File) => {
  const extension = getFileExtension(file);

  if (
    TEXT_FILE_TYPES.has(file.type) ||
    ["txt", "csv", "md", "json", "xml", "log"].includes(extension)
  ) {
    return file.text();
  }

  if (file.type === "application/pdf" || extension === "pdf") {
    return extractPdfText(file);
  }

  if (
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    extension === "docx"
  ) {
    return extractWordText(file);
  }

  throw new Error(
    "This file type is not supported yet. Please upload a PDF, DOCX, TXT, CSV, JSON, XML, or Markdown file.",
  );
};
