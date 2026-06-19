export type AIProvider = 'google' | 'nvidia';

export interface AIModel {
  /**
   * Internal unique identifier for the model used within the app (e.g., 'gemini-fast', 'nim-balanced', 'nim-advanced').
   */
  id: string;
  /**
   * User-facing label or display name of the model.
   */
  name: string;
  /**
   * The model provider (Google or NVIDIA NIM).
   */
  provider: AIProvider;
  /**
   * The actual provider-specific model identifier used for API calls (e.g., 'gemini-2.5-flash').
   */
  providerModelId: string;
  /**
   * A short description describing the model's key strengths or target use cases.
   */
  description: string;
  /**
   * A badge or tier label for the UI (e.g., 'Fast', 'Balanced', 'Advanced').
   */
  badge: string;
  /**
   * Flag indicating if this model is the default selection.
   */
  isDefault: boolean;
}

/**
 * Interface representing a model option stripped of integration-specific details,
 * safe for client-side UI selection components.
 */
export interface SelectorSafeModel {
  id: string;
  name: string;
  provider: AIProvider;
  description: string;
  badge: string;
  isDefault: boolean;
}

// Environment-driven provider model ID resolution with default fallbacks
const GEMINI_MODEL_FAST_ID = process.env.GEMINI_MODEL_FAST || 'gemini-2.5-flash';
const NIM_MODEL_FAST_ID = process.env.NIM_MODEL_FAST || 'mistralai/mistral-nemotron';
const NIM_MODEL_SMART_ID = process.env.NIM_MODEL_SMART || 'nvidia/nemotron-3-ultra-550b-a55b';

// Raw model definitions template
const modelsTemplate = [
  {
    id: 'gemini-fast',
    name: 'Gemini 2.5/3.5 Flash',
    provider: 'google' as AIProvider,
    providerModelId: GEMINI_MODEL_FAST_ID,
    description: 'Default fast model optimized for quick responses, summarization, and high-speed chat.',
    badge: 'Fast',
  },
  {
    id: 'nim-balanced',
    name: 'Mistral Nemotron',
    provider: 'nvidia' as AIProvider,
    providerModelId: NIM_MODEL_FAST_ID,
    description: 'Balanced NIM model with robust reasoning capability and moderate latency.',
    badge: 'Balanced',
  },
  {
    id: 'nim-advanced',
    name: 'Nemotron 3 Ultra 550B A55B',
    provider: 'nvidia' as AIProvider,
    providerModelId: NIM_MODEL_SMART_ID,
    description: 'Advanced NIM model designed for complex reasoning, planning, and deep analysis.',
    badge: 'Advanced',
  },
];

// Determine the default model ID by checking DEFAULT_CHAT_MODEL environment variable
const defaultModelId = (() => {
  const envDefault = process.env.DEFAULT_CHAT_MODEL;
  if (!envDefault) return 'gemini-fast';

  // Check if env match is by internal ID or providerModelId
  const hasMatch = modelsTemplate.some(
    (m) => m.id === envDefault || m.providerModelId === envDefault
  );
  return hasMatch ? envDefault : 'gemini-fast';
})();

/**
 * Single source of truth for the available AI models.
 */
export const AVAILABLE_MODELS: AIModel[] = modelsTemplate.map((model) => ({
  ...model,
  isDefault: model.id === defaultModelId || model.providerModelId === defaultModelId,
}));

/**
 * Returns a list of all registered models with full details.
 */
export function getAllModels(): AIModel[] {
  return AVAILABLE_MODELS;
}

/**
 * Returns a sanitized list of model options safe to expose to client-side components.
 */
export function getSelectorSafeModels(): SelectorSafeModel[] {
  return AVAILABLE_MODELS.map(({ id, name, provider, description, badge, isDefault }) => ({
    id,
    name,
    provider,
    description,
    badge,
    isDefault,
  }));
}

/**
 * Retrieves a model by its internal identifier or provider model identifier.
 */
export function getModelById(id: string): AIModel | undefined {
  return AVAILABLE_MODELS.find((model) => model.id === id || model.providerModelId === id);
}

/**
 * Resolves the designated default chat model.
 */
export function getDefaultModel(): AIModel {
  return AVAILABLE_MODELS.find((model) => model.isDefault) || AVAILABLE_MODELS[0];
}
