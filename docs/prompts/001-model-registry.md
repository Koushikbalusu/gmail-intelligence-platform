# Prompt Change Log: 001-model-registry

## Goal
Establish a single, strongly-typed source of truth for selectable AI models in the Gmail Intelligence Platform, configuring both Google Gemini and NVIDIA NIM options in a clean, framework-agnostic registry.

## Target Files
- [lib/ai/models.ts](file:///home/koushik/Documents/gmail-intelligence-platform/lib/ai/models.ts)
- [docs/prompts/001-model-registry.md](file:///home/koushik/Documents/gmail-intelligence-platform/docs/prompts/001-model-registry.md)
- [docs/prompts/BUILD_LOG.md](file:///home/koushik/Documents/gmail-intelligence-platform/docs/prompts/BUILD_LOG.md)
- [docs/BUILD_LOG.md](file:///home/koushik/Documents/gmail-intelligence-platform/docs/BUILD_LOG.md)

## Architecture Context
The application supports multiple AI providers: Google (default fast models like Gemini 2.5/3.5 Flash) and NVIDIA NIM (Mistral Nemotron and Nemotron 3 Ultra). The selected model is determined per chat session and stored in the database. Client selectors need access to metadata (e.g. badges, display names, descriptions) without exposing credentials, dynamic runtime imports from provider SDKs, or React-dependent framework logic.

## What Was Implemented
- Created `lib/ai/models.ts` defining:
  - Typed provider definition (`google` | `nvidia`).
  - Strict interfaces for models (`AIModel`, `SelectorSafeModel`).
  - Available models mapping with default environment-driven IDs (`GEMINI_MODEL_FAST`, `NIM_MODEL_FAST`, `NIM_MODEL_SMART`).
  - Helper functions for resolving default models, getting list of models, and getting selector-safe models for UI.
- Initialized documentation files `docs/prompts/001-model-registry.md`, `docs/prompts/BUILD_LOG.md`, and `docs/BUILD_LOG.md`.

## Why It Matters
- **Type Safety**: Avoids hardcoding magic strings across client and API route components.
- **Provider Decoupling**: Exposes UI-safe objects containing display information (badges, names, descriptions) while shielding actual API routing keys or provider SDK packages.
- **Configurability**: Environment variables can switch the underlying models seamlessly (e.g. upgrading Gemini 2.5 to 3.5 without code change) while defaulting safely if environment files are not loaded.

## Assumptions
- Custom provider model IDs from environment variables are properly formatted matching their respective API guidelines.
- The `DEFAULT_CHAT_MODEL` points to either a registered internal ID (e.g., `'gemini-fast'`) or a raw provider model ID (e.g., `'gemini-2.5-flash'`).

## Manual Review Checklist
- [ ] No React component code exists in `lib/ai/models.ts`.
- [ ] No browser-specific or Next.js-specific imports are used (pure, framework-agnostic ES module).
- [ ] Fallback configurations resolve successfully when environment variables are omitted.
- [ ] Exposes only display-safe attributes in `getSelectorSafeModels()`.
