# ChatGrow Free Tools

Technical, operational, onboarding, and handover documentation for the ChatGrow Free Tools web application.

**Documentation status:** June 8, 2026

**Application type:** React single-page application with a Vercel serverless API

**Primary purpose:** Provide free AI-powered writing and document analysis tools that introduce users to the ChatGrow product ecosystem.

Documentation files:

- `README.md`: Repository-native source of truth.
- `docs/ChatGrow_Free_Tools_Technical_and_Operations_Manual.docx`: Black-and-white Word handover manual.
- `scripts/build_chatgrow_documentation.py`: Rebuilds the DOCX from this README using the bundled document runtime.

## Table of Contents

1. [Product Overview](#product-overview)
2. [Business Purpose](#business-purpose)
3. [Available Tools and URLs](#available-tools-and-urls)
4. [User Walkthrough](#user-walkthrough)
5. [Document Upload Experience](#document-upload-experience)
6. [System Architecture](#system-architecture)
7. [Request and Data Flow](#request-and-data-flow)
8. [Technology Stack](#technology-stack)
9. [Repository Structure](#repository-structure)
10. [Local Setup](#local-setup)
11. [Environment Variables and Secrets](#environment-variables-and-secrets)
12. [Development Commands](#development-commands)
13. [Deployment](#deployment)
14. [Tool Configuration Model](#tool-configuration-model)
15. [Adding a New Tool](#adding-a-new-tool)
16. [AI API Integration](#ai-api-integration)
17. [Usage Limits](#usage-limits)
18. [Privacy and Data Handling](#privacy-and-data-handling)
19. [Testing and Quality Checks](#testing-and-quality-checks)
20. [Troubleshooting](#troubleshooting)
21. [Current Limitations](#current-limitations)
22. [Production Hardening Recommendations](#production-hardening-recommendations)
23. [New Team Member Onboarding](#new-team-member-onboarding)
24. [Sale and Technical Handover Checklist](#sale-and-technical-handover-checklist)
25. [Operational Runbook](#operational-runbook)
26. [Ownership Map](#ownership-map)
27. [Glossary](#glossary)

## Product Overview

ChatGrow Free Tools is a collection of focused AI utilities served from one lightweight web application. A tool is selected through the `tool` query parameter. The same React layout renders every tool from a configuration object.

Examples:

```text
http://127.0.0.1:5173/?tool=ai-reply-generator
http://127.0.0.1:5173/?tool=ai-chat-pdf-document-data
```

If the `tool` parameter is missing or unknown, the application opens the AI Reply Generator.

The product currently includes:

- Five writing and content-generation tools.
- Four document and data chat tools.
- Browser-side extraction for PDF, DOCX, and supported text formats.
- A shared AI generation endpoint.
- A browser-local free usage limit.
- A post-result call to action that directs users to `https://app.chatgrow.co`.

## Business Purpose

The application supports three business goals:

1. **Lead generation:** Give visitors immediate value before asking them to try ChatGrow.
2. **Product education:** Demonstrate practical AI use cases such as writing, summarization, data querying, and document analysis.
3. **Conversion:** Display a ChatGrow trial call to action after a successful AI result.

For a buyer or commercial partner, the application should be understood as a top-of-funnel utility product. It is not currently a full authenticated SaaS platform. It does not include user accounts, subscriptions, centralized usage records, document storage, or an administration dashboard.

## Available Tools and URLs

Replace `{BASE_URL}` with:

- Local development: `http://127.0.0.1:5173`
- Production: the deployed website origin, for example `https://tools.example.com`

| Tool | Tool ID | URL |
|---|---|---|
| AI Reply Generator | `ai-reply-generator` | `{BASE_URL}/?tool=ai-reply-generator` |
| Social Bio Generator | `social-bio-generator` | `{BASE_URL}/?tool=social-bio-generator` |
| AI Blog Title Generator | `blog-title-generator` | `{BASE_URL}/?tool=blog-title-generator` |
| AI Prompt Generator | `ai-prompt-generator` | `{BASE_URL}/?tool=ai-prompt-generator` |
| AI FAQ Generator | `ai-faq-generator` | `{BASE_URL}/?tool=ai-faq-generator` |
| AI Chat with your Document and Data | `ai-chat-document-data` | `{BASE_URL}/?tool=ai-chat-document-data` |
| AI Chat with Your Text Data | `ai-chat-text-data` | `{BASE_URL}/?tool=ai-chat-text-data` |
| AI Chat with Your PDF Document and Data | `ai-chat-pdf-document-data` | `{BASE_URL}/?tool=ai-chat-pdf-document-data` |
| AI Chat with Your Word Document and Data | `ai-chat-word-document-data` | `{BASE_URL}/?tool=ai-chat-word-document-data` |

### Tool Details

#### AI Reply Generator

**Purpose:** Generates three reply variations for email, social media, or general professional communication.

**Inputs:**

- Message to reply to.
- Tone: professional, friendly, humorous, empathetic, or direct.
- Optional platform, such as LinkedIn, Gmail, or X.

#### Social Bio Generator

**Purpose:** Generates social media bios for Instagram and X/Twitter.

**Inputs:**

- Description of the person or brand.
- Style or vibe.
- Optional keyword.

**Current implementation note:** The `style` select is configured without option values. This should be corrected before presenting the tool as fully production-ready.

#### AI Blog Title Generator

**Purpose:** Generates ten SEO-oriented title ideas in multiple title formats.

**Inputs:**

- Keywords.
- Blog summary.
- Target audience.
- Language.
- Tone.

#### AI Prompt Generator

**Purpose:** Converts requirements into a structured prompt that can be used with an AI model.

**Inputs:**

- Framework: PARE, RTF, CREATE, or Basic.
- Action.
- Purpose.
- Expected result.

#### AI FAQ Generator

**Purpose:** Generates questions and answers from supplied content.

**Inputs:**

- Source content.
- Number of FAQs.
- Language.
- Tone.

#### AI Chat with your Document and Data

**Purpose:** Accepts a supported document or data file and answers a question using the extracted content.

**Accepted formats:** PDF, DOCX, TXT, CSV, Markdown, JSON, and XML.

#### AI Chat with Your Text Data

**Purpose:** Accepts pasted plain text and answers questions, summarizes it, or extracts insights.

**Typical sources:** Reports, articles, transcripts, policies, meeting notes, and research.

#### AI Chat with Your PDF Document and Data

**Purpose:** Extracts text from a PDF in the browser, then answers a user question using that text.

**Accepted format:** PDF.

#### AI Chat with Your Word Document and Data

**Purpose:** Extracts raw text from a Word document in the browser, then answers a user question using that text.

**Accepted format:** DOCX. Legacy `.doc` files are not supported.

## User Walkthrough

### Writing Tools

1. Open the URL for the required tool.
2. Complete all required fields.
3. Select any required tone, language, framework, or style.
4. Select the generate button.
5. Wait for the AI response.
6. Review the result.
7. Use **Copy Result** to copy the response.
8. Use the reset button to clear the form and result.
9. After a result, the ChatGrow trial call to action becomes visible.

### Document Chat Tools

1. Open the required document tool URL.
2. Select **Choose a file to chat with**.
3. Choose a supported file.
4. Wait while the browser extracts readable text.
5. Confirm the uploaded-state panel shows:
   - File name.
   - File size.
   - Extracted character count.
   - Short text preview.
   - `Ready` status.
6. Enter a question or instruction.
7. Select **Generate Answer**.
8. Review and copy the response.
9. Select **Replace file** to upload a different document.
10. Select **Remove** to clear the current document.

### Text Data Chat Tool

1. Paste the complete source text.
2. Enter a question or request, such as:
   - “Summarize this in five bullet points.”
   - “What are the main risks?”
   - “List all deadlines and responsible parties.”
   - “What does the policy say about refunds?”
3. Select **Generate Answer**.
4. Validate the result against the original source before relying on it.

## Document Upload Experience

File extraction occurs in the browser:

- `pdfjs-dist` extracts text from PDF pages.
- `mammoth` extracts raw text from DOCX files.
- The browser `File.text()` API reads text-like formats.

Once extraction succeeds, the UI stores the text in React state and shows a ready panel. The original file is not intentionally uploaded as a binary file by this code. However, the extracted text is included in the prompt and sent to `/api/generate`.

### Supported File Types

| Format | Extension | Extraction method | Notes |
|---|---|---|---|
| PDF | `.pdf` | PDF.js | Image-only or scanned PDFs require OCR, which is not included. |
| Word | `.docx` | Mammoth | Raw text only; layout, images, comments, and most formatting are not preserved. |
| Plain text | `.txt`, `.log` | Browser text reader | Read directly. |
| CSV | `.csv` | Browser text reader | Sent as plain text; there is no structured table analysis layer. |
| Markdown | `.md` | Browser text reader | Sent as plain text. |
| JSON | `.json` | Browser text reader | Sent as plain text; not schema-validated. |
| XML | `.xml` | Browser text reader | Sent as plain text; not schema-validated. |

### Upload Error Conditions

The UI reports an error when:

- The file type is unsupported.
- The parser cannot read the file.
- No readable text is found.
- A PDF is image-only and contains no embedded text.
- A DOCX is damaged, encrypted, or otherwise unreadable.

## System Architecture

```mermaid
flowchart LR
    A[User Browser] --> B[React and Vite Frontend]
    B --> C[Tool Configuration Registry]
    B --> D[Browser File Extraction]
    D --> E[Extracted Text in React State]
    C --> F[System and User Prompt]
    E --> F
    F --> G[/api/generate]
    G --> H[OpenAI Chat Completions API]
    H --> G
    G --> B
    B --> I[Displayed Result]
    I --> J[ChatGrow Trial CTA]
```

### Architectural Characteristics

- One React application serves every tool.
- Tools are data-driven configuration objects.
- Tool selection uses a query string rather than separate routes.
- File parsing runs in the browser.
- AI requests go through a serverless function to keep the API key out of browser code.
- Results are returned as plain text.
- No database is used.
- No authentication layer is used.
- No uploaded files or AI results are intentionally persisted by the application.

## Request and Data Flow

1. `src/App.tsx` reads `window.location.search`.
2. `getToolById()` finds the requested tool in `src/tools/index.ts`.
3. `ToolLayout` renders inputs from the tool configuration.
4. If an input is a file:
   - The browser reads the file.
   - `extractFileText()` converts it to plain text.
   - The extracted text is stored in component state.
5. When the form is submitted:
   - The browser-local usage limit is checked.
   - The tool configuration creates the user prompt.
   - `generateText()` sends the system prompt and user prompt to `/api/generate`.
6. The serverless function:
   - Reads `OPENAI_API_KEY`.
   - Calls the OpenAI Chat Completions endpoint.
   - Uses the model string currently configured in `api/generate.ts`.
   - Requests plain-text output.
   - Returns the result to the browser.
7. The browser displays the result and records a timestamp in `localStorage`.

## Technology Stack

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | React 19 | UI state and rendering |
| Language | TypeScript | Type safety |
| Build tool | Vite 8 | Development server and production build |
| Styling | Tailwind CSS 4 | Utility-first styling |
| Icons | Lucide React | Interface icons |
| PDF extraction | `pdfjs-dist` | Browser-side PDF text extraction |
| Word extraction | `mammoth` | Browser-side DOCX raw-text extraction |
| API runtime | Vercel Node function | Secure server-side AI request |
| AI provider | OpenAI API | Text generation and document-based answers |
| Persistence | Browser `localStorage` | Per-tool usage timestamps only |

## Repository Structure

```text
chatgrowtools/
|-- api/
|   `-- generate.ts                  # Serverless AI endpoint
|-- public/
|   |-- favicon.svg
|   `-- icons.svg
|-- src/
|   |-- components/
|   |   |-- MarketingSection.tsx    # Conversion call to action
|   |   |-- ToolLayout.tsx          # Shared form, upload, result, and limit UI
|   |   `-- ui-components.tsx       # Shared button, input, label, and card
|   |-- lib/
|   |   |-- extractFileText.ts      # PDF, DOCX, and text extraction
|   |   `-- utils.ts                # Class-name helper
|   |-- services/
|   |   `-- aiService.ts            # Browser API client
|   |-- tools/
|   |   |-- configs/                # Individual tool definitions and prompts
|   |   `-- index.ts                # Tool registry and fallback
|   |-- types/
|   |   `-- tool.ts                 # Tool configuration interfaces
|   |-- App.tsx                     # Query-parameter tool selection
|   |-- index.css                   # Global theme and Tailwind import
|   `-- main.tsx                    # React entry point
|-- .env                            # Local secret; ignored by Git
|-- package.json
|-- vite.config.ts
`-- README.md
```

## Local Setup

### Prerequisites

- Node.js compatible with the installed dependency versions.
- npm.
- An OpenAI API key with access to the model configured in `api/generate.ts`.
- Git for source control.

### Installation

```powershell
git clone <repository-url>
cd chatgrowtools
npm.cmd install
```

On Windows PowerShell systems that allow the normal npm shim:

```powershell
npm install
```

### Configure the Environment

Create a local `.env` file:

```dotenv
OPENAI_API_KEY=your_openai_api_key
```

Do not place the key in frontend source files or commit `.env`.

### Start the Frontend

```powershell
npm.cmd run dev -- --host 127.0.0.1 --port 5173
```

Open:

```text
http://127.0.0.1:5173/?tool=ai-reply-generator
```

### Local API Consideration

The frontend calls `/api/generate`. A plain Vite development server does not automatically emulate Vercel serverless functions. For complete local AI testing, run the project in a Vercel-compatible local environment or provide an equivalent proxy for `/api/generate`.

The Vite server alone is sufficient for:

- Rendering the UI.
- Testing tool selection.
- Testing forms.
- Testing PDF, DOCX, and text extraction.
- Testing upload success and error states.

## Environment Variables and Secrets

| Variable | Required | Used by | Purpose |
|---|---|---|---|
| `OPENAI_API_KEY` | Yes for AI responses | `api/generate.ts` | Authenticates server-side OpenAI requests |

### Secret Handling Rules

- Keep `.env` ignored by Git.
- Store production secrets in the deployment platform’s encrypted environment variable settings.
- Never expose the key through a `VITE_` environment variable.
- Never log the key.
- Rotate the key during a sale, ownership transfer, suspected exposure, or staff departure.
- The seller should not transfer a personal OpenAI key to a buyer. The buyer should provision a new key.

## Development Commands

```powershell
# Start development server
npm.cmd run dev

# Type-check and build production assets
npm.cmd run build

# Run the repository lint command
npm.cmd run lint

# Run a focused lint pass over application code
npx.cmd eslint src api

# Preview the production build
npm.cmd run preview
```

The production output is generated in `dist/` and is ignored by Git.

## Deployment

The repository is structured for Vercel:

- Vite builds the frontend.
- `api/generate.ts` is deployed as a serverless function.
- The production environment must define `OPENAI_API_KEY`.

### Suggested Vercel Deployment Procedure

1. Import the Git repository into Vercel.
2. Confirm the framework/build configuration detects Vite.
3. Set the build command to `npm run build` if it is not auto-detected.
4. Set the output directory to `dist`.
5. Add `OPENAI_API_KEY` to Production, Preview, and Development environments as required.
6. Deploy.
7. Test every tool URL on the deployed domain.
8. Test at least one successful AI request.
9. Test PDF and DOCX extraction.
10. Confirm the ChatGrow trial link opens `https://app.chatgrow.co`.

### Domain Change

The application uses relative API requests, so changing the public domain normally does not require frontend code changes. Update external links, marketing pages, bookmarks, documentation, and analytics configuration that refer to the previous domain.

## Tool Configuration Model

All tools implement `ToolConfig` from `src/types/tool.ts`.

```ts
interface ToolConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  inputs: ToolInput[];
  systemPrompt: string;
  userPromptTemplate: (inputs: Record<string, string>) => string;
  usageSteps?: string[];
}
```

Supported input types:

```ts
"textarea" | "text" | "select" | "number" | "file"
```

Each input can define:

- `id`: Key used in form state and prompt generation.
- `label`: Visible field label.
- `type`: Rendering behavior.
- `placeholder`: Input hint.
- `required`: Browser validation requirement.
- `options`: Select options.
- `defaultValue`: Intended default value.
- `halfWidth`: Uses one column on wider screens.
- `accept`: File picker restrictions.

### Important Configuration Behavior

The form currently initializes `inputs` as an empty object. `defaultValue` in a tool configuration is not automatically copied into form state. Selects therefore begin with the disabled placeholder until the user chooses an option.

## Adding a New Tool

1. Create a configuration file under `src/tools/configs/`.
2. Export a valid `ToolConfig`.
3. Use a unique, URL-safe `id`.
4. Define all inputs.
5. Write a narrow system prompt.
6. Build the user prompt only from the declared input IDs.
7. Add useful usage steps.
8. Import the configuration in `src/tools/index.ts`.
9. Add it to the `tools` record.
10. Test the URL:

```text
http://127.0.0.1:5173/?tool=<new-tool-id>
```

11. Run:

```powershell
npm.cmd run build
npx.cmd eslint src api
```

12. Update this README and the handover DOCX.

### New Tool Review Checklist

- The tool ID is unique.
- Required inputs are marked correctly.
- Every select has options.
- Input IDs match prompt-template references.
- Prompt content does not expose internal secrets.
- Button wording is appropriate.
- Usage steps match the actual UI.
- Mobile layout is readable.
- Errors are understandable.
- The daily limit behavior is acceptable.
- The result is plain text and copyable.

## AI API Integration

### Browser Client

`src/services/aiService.ts` sends:

```json
{
  "systemPrompt": "Tool-specific system instruction",
  "userPrompt": "Tool-specific request and user content"
}
```

### Serverless Endpoint

`api/generate.ts`:

1. Reads `OPENAI_API_KEY`.
2. Calls the OpenAI Chat Completions endpoint.
3. Sends a system message and user message.
4. Adds an instruction to return plain text.
5. Returns `{ "result": "..." }`.

The model name and generation settings are hardcoded in this file. Any model change should be treated as a controlled release because it can affect cost, latency, quality, output style, and API compatibility.

### Error Behavior

- Missing key: HTTP 500 with `OPENAI_API_KEY not configured`.
- Provider error: provider status code with an error message when available.
- Unexpected exception: HTTP 500 with `Internal Server Error`.
- Browser failure: the result panel displays `Failed to generate response. Please try again.`

## Usage Limits

Each tool allows two successful uses during a rolling 24-hour window.

Implementation details:

- The constant is `USAGE_LIMIT = 2`.
- The window is `24 * 60 * 60 * 1000` milliseconds.
- Timestamps are stored under `usage_<tool-id>` in browser `localStorage`.
- Usage is recorded only after a successful response.
- Each tool has a separate counter.

### What This Limit Does Not Provide

- It is not tied to an account.
- It is not shared across browsers or devices.
- It can be reset by clearing browser storage.
- It does not protect the API endpoint from direct calls.
- It is not a billing-grade or abuse-prevention control.

## Privacy and Data Handling

### What Remains in the Browser

- The original selected file object.
- File name, size, extraction preview, and extracted character count in React state.
- Usage timestamps in `localStorage`.
- Displayed result in React state.

### What Is Transmitted

- Tool system prompt.
- User question or instruction.
- User-entered text.
- Extracted document text for file-based tools.

This content is transmitted to the application’s serverless function and then to the configured AI provider.

### What Is Not Intentionally Persisted

- Original binary files.
- Extracted document text.
- User prompts.
- AI results.

This statement describes the application code only. Deployment platform logs, network infrastructure, analytics, monitoring tools, and the AI provider may have their own retention behavior and must be reviewed separately.

### Required Customer-Facing Disclosure

Before accepting confidential or regulated documents, publish a privacy notice that explains:

- Which data is sent to an AI provider.
- Whether data is retained.
- Who controls and processes the data.
- Whether sensitive, personal, legal, financial, medical, or regulated content is permitted.
- How users can request deletion or support.

## Testing and Quality Checks

### Automated Checks

```powershell
npm.cmd run build
npx.cmd eslint src api
```

### Manual Smoke Test Matrix

| Area | Test |
|---|---|
| Tool routing | Open every `?tool=` URL and verify the correct title and fields. |
| Fallback | Open the root URL and an unknown tool ID; verify Reply Generator loads. |
| Required fields | Submit empty forms and confirm browser validation. |
| AI success | Submit valid content and confirm a result appears. |
| AI failure | Remove or invalidate the API key and confirm a readable error. |
| Copy | Select Copy Result and verify clipboard content. |
| Reset | Confirm form and result are cleared. |
| Limit | Complete two successful requests, then verify the limit message. |
| PDF | Upload a text-based PDF and verify preview and answer flow. |
| Scanned PDF | Upload an image-only PDF and verify the no-readable-text error. |
| DOCX | Upload a DOCX and verify extracted text preview. |
| Text formats | Test TXT and CSV through the general document tool. |
| Replace | Replace an uploaded file and verify metadata changes. |
| Remove | Remove a file and verify the upload state returns. |
| Responsive layout | Test narrow mobile and desktop widths. |
| CTA | Confirm the trial button opens the ChatGrow application. |

### Release Acceptance Criteria

- Build passes.
- Focused lint passes.
- Every production URL loads.
- The API key is configured only server-side.
- At least one real AI request succeeds.
- File parsing works for one PDF and one DOCX.
- No browser console errors occur in the main flows.
- The production domain and ChatGrow CTA are correct.

## Troubleshooting

### The UI Loads but Generate Fails

Check:

- The serverless endpoint is available at `/api/generate`.
- `OPENAI_API_KEY` exists in the runtime environment.
- The configured model is available to the API account.
- The API account has billing or credits configured.
- Provider status and deployment logs.
- Browser Network and Console panels.

### `OPENAI_API_KEY not configured`

Add the variable to the correct local or deployed environment and restart or redeploy the application.

### Vite Works but `/api/generate` Returns 404

The Vite development server is serving only the frontend. Run a local environment that also emulates the Vercel API function or configure a development proxy.

### PDF Upload Finds No Text

The PDF may be scanned or image-only. OCR is not implemented. Use a text-based PDF, perform OCR before upload, or add an OCR service.

### DOCX Upload Fails

Confirm:

- The file uses `.docx`, not legacy `.doc`.
- The document is not encrypted.
- The file opens normally in Word.
- The file is not damaged.

### A Select Field Has No Options

Inspect the tool configuration. Every `select` input must include an `options` array. The current Social Bio Generator style field requires this correction.

### User Reaches the Limit Unexpectedly

Inspect browser storage for the relevant `usage_<tool-id>` key. The window is rolling rather than resetting at midnight.

### Build Warns About Large Chunks

PDF.js and its worker are large browser dependencies. The current application bundles document parsing into the main client build. Consider lazy-loading parser modules only on tools that require uploads.

## Current Limitations

These are current product facts, not merely future ideas:

- No user authentication.
- No central usage tracking.
- No database or admin panel.
- No server-side rate limiting.
- Browser-local limits can be bypassed.
- No file-size limit is enforced in the UI.
- No prompt-size or token-budget guard is implemented.
- Long documents are sent as one prompt without chunking or retrieval.
- No OCR for scanned PDFs.
- No support for legacy `.doc`.
- No spreadsheet parser for `.xlsx`.
- CSV, JSON, and XML are treated as plain text.
- DOCX formatting, tables, images, headers, comments, and tracked changes are not preserved as structured data.
- The tool query parameter does not change without a full navigation or reload.
- Tool icons are stored in configuration but are not dynamically rendered.
- Configured input `defaultValue` values are not initialized into state.
- Some generic UI copy is inaccurate for tools other than reply and bio generation.
- The API endpoint does not validate HTTP method, request shape, or maximum payload.
- The serverless function strips `#` and `*` characters from the result.
- No analytics or conversion event tracking is implemented in the repository.
- No automated test suite is currently configured.
- No legal consent flow or privacy acknowledgement is present.

## Production Hardening Recommendations

Prioritize these before high-volume promotion, enterprise onboarding, or a sale represented as production-ready:

### Priority 0: Security

- Rotate any API key that may have been exposed.
- Add request validation and method checks.
- Add server-side rate limiting and abuse controls.
- Enforce request and document size limits.
- Add security headers.
- Add a public privacy notice and terms.
- Review AI provider and deployment retention policies.

### Priority 1: Reliability

- Add centralized error monitoring.
- Add request IDs and structured logs without sensitive content.
- Add provider timeouts and retry policy.
- Handle malformed provider responses safely.
- Move the model name to an environment variable or controlled configuration.
- Add health and deployment checks.

### Priority 2: Document Intelligence

- Add chunking for long documents.
- Add embeddings or retrieval for large files.
- Add OCR for scanned PDFs.
- Add structured CSV and spreadsheet analysis.
- Add page or section citations to document answers.
- Add document-size and extracted-character limits before submission.

### Priority 3: Product Quality

- Initialize configured default values.
- Correct the Social Bio style options.
- Make action labels and onboarding headings tool-specific.
- Add accessible descriptions and keyboard testing.
- Lazy-load PDF and DOCX parser code.
- Add route-level metadata and meaningful page titles.
- Add product analytics and conversion tracking with consent.

### Priority 4: Engineering Operations

- Add unit tests for prompt templates and file-type routing.
- Add component tests for upload, reset, and limits.
- Add API integration tests.
- Add end-to-end tests for every tool URL.
- Add continuous integration for build and lint.
- Add release notes and a change log.

## New Team Member Onboarding

### First-Day Reading Order

1. Read this README.
2. Review `src/tools/index.ts`.
3. Review `src/types/tool.ts`.
4. Review one writing tool config.
5. Review `src/tools/configs/documentChatTools.ts`.
6. Review `src/components/ToolLayout.tsx`.
7. Review `src/lib/extractFileText.ts`.
8. Review `src/services/aiService.ts`.
9. Review `api/generate.ts`.

### First-Day Setup

1. Clone the repository.
2. Install dependencies.
3. Create a local `.env`.
4. Start the frontend.
5. Open all tool URLs.
6. Run build and focused lint.
7. Test one text tool.
8. Test one PDF.
9. Test one DOCX.

### First-Week Tasks

- Understand how a tool configuration becomes a form and prompt.
- Review deployment settings and logs.
- Confirm who owns the OpenAI account and billing.
- Confirm who owns the domain and Vercel project.
- Review privacy wording.
- Fix one known limitation.
- Add or improve one automated test.
- Practice deploying to a preview environment.

### Safe Change Procedure

1. Pull the latest branch and inspect working-tree changes.
2. Create a feature branch.
3. Make the smallest coherent change.
4. Run build and focused lint.
5. Manually test affected tool URLs.
6. Test one unaffected tool for regression.
7. Open a pull request with screenshots when UI changes.
8. Deploy to preview.
9. Get review.
10. Merge and verify production.

## Sale and Technical Handover Checklist

### Source and Intellectual Property

- Repository ownership transferred.
- Default branch and branch protections documented.
- Open-source dependencies and licenses reviewed.
- Product name, logo, copy, and domain rights confirmed.
- Any contractor or contributor IP assignments confirmed.

### Infrastructure

- Vercel project transferred or recreated.
- Production and preview domains transferred.
- DNS access transferred.
- Environment variables recreated under buyer ownership.
- Build and output settings verified.
- Deployment logs accessible to the buyer.

### AI Provider

- Buyer creates its own OpenAI organization/project.
- Buyer adds its own payment method and limits.
- A new API key is created.
- Seller-owned keys are revoked.
- Configured model access is verified.
- Expected usage cost and rate limits are documented.

### Product and Operations

- Every production tool URL is tested.
- Usage-limit behavior is explained.
- File handling and privacy behavior are explained.
- Known limitations are accepted in writing.
- Support contacts and escalation path are transferred.
- Analytics, monitoring, legal pages, and incident procedures are transferred or identified as missing.

### Credentials That Must Never Be Sent in Documentation

- API keys.
- Deployment tokens.
- Domain registrar passwords.
- Personal account passwords.
- Recovery codes.

Use the destination platform’s secure invitation or secret-transfer process.

### Recommended Handover Session

Allow 60-90 minutes:

1. Product walkthrough.
2. Repository and architecture walkthrough.
3. Local setup demonstration.
4. Deployment demonstration.
5. Environment variable and key ownership review.
6. Live test of a writing tool, PDF tool, and DOCX tool.
7. Review of limits, privacy, and known risks.
8. Buyer performs a supervised change and preview deployment.
9. Agree on post-transfer support period and boundaries.

## Operational Runbook

### Before a Release

- Review changed files.
- Run build and lint.
- Test affected tools locally.
- Test upload parsers if dependencies changed.
- Confirm no secrets are in Git changes.
- Deploy a preview.
- Test the preview URL and API.

### After a Release

- Open the production root URL.
- Open one writing tool.
- Open one document tool.
- Perform one successful AI request.
- Review serverless logs for new errors.
- Confirm conversion CTA.
- Record the release and rollback point.

### AI Provider Incident

1. Confirm whether the failure is provider-wide or application-specific.
2. Check serverless logs and provider status.
3. Verify billing, access, model availability, and rate limits.
4. Do not expose raw provider errors containing sensitive details to users.
5. Roll back a recent model or API change if relevant.
6. Communicate service status.
7. Document the incident and corrective action.

### Suspected Secret Exposure

1. Revoke the exposed key immediately.
2. Create a replacement key.
3. Update deployment environment variables.
4. Redeploy.
5. Review provider usage and logs.
6. Review Git history, build logs, chat messages, screenshots, and shared documents.
7. Document scope and impact.

### Rollback

Use the deployment platform’s previous known-good deployment or revert the responsible Git commit through the normal review process. After rollback, repeat the production smoke test.

## Ownership Map

The handover owner should fill in this table:

| Area | Primary owner | Backup owner | System/account |
|---|---|---|---|
| Product | TBD | TBD | Product roadmap |
| Frontend | TBD | TBD | Git repository |
| Serverless API | TBD | TBD | Vercel |
| AI provider | TBD | TBD | OpenAI organization/project |
| Domain and DNS | TBD | TBD | Registrar/DNS provider |
| Privacy and legal | TBD | TBD | Legal documents |
| Monitoring | TBD | TBD | Monitoring provider |
| Customer support | TBD | TBD | Support channel |
| Billing | TBD | TBD | Vercel/OpenAI/payment accounts |

## Glossary

**AI provider:** The external service that generates responses from prompts.

**DOCX:** Modern Microsoft Word document format supported by the Word chat tool.

**Extracted text:** Plain text read from an uploaded file before it is sent for AI analysis.

**Local storage:** Browser storage used here to remember usage timestamps on one browser profile.

**Prompt:** The system instruction and user request sent to the AI model.

**Serverless function:** Backend code executed on demand without managing a traditional server.

**Tool configuration:** A TypeScript object that defines a tool’s name, fields, prompt, and instructions.

**Tool ID:** The value used in the `?tool=` query parameter.

**Vercel preview:** A temporary deployment used to review changes before production.
