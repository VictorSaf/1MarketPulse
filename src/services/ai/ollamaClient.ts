/**
 * Ollama AI Client for PULSE
 * Provides local AI-powered analysis for financial data
 * Documentation: https://ollama.com/
 */

interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  format?: 'json' | '';
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
}

interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_duration?: number;
  eval_duration?: number;
}

interface OllamaHealthResponse {
  status: string;
  models?: string[];
}

class OllamaClient {
  private baseURL: string;
  private defaultModel: string;
  private isAvailable: boolean = false;

  constructor(baseURL: string = 'http://localhost:11434', defaultModel: string = 'llama3.2:3b') {
    this.baseURL = baseURL;
    this.defaultModel = defaultModel;
    this.checkHealth().then(available => {
      this.isAvailable = available;
      if (!available) {
        console.warn('Ollama is not available. AI features will be disabled. Please install Ollama: https://ollama.com/');
      }
    });
  }

  /**
   * Check if Ollama service is running
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/api/tags`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data: OllamaHealthResponse = await response.json();
        console.log('Ollama is available:', data);
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Ollama health check failed:', error);
      return false;
    }
  }

  /**
   * Generate text with Ollama
   * @param prompt - The prompt to send to the model
   * @param options - Generation options
   * @returns Generated text response
   */
  async generate(
    prompt: string,
    options: Partial<OllamaGenerateRequest> = {}
  ): Promise<string> {
    if (!this.isAvailable) {
      throw new Error('Ollama is not available. Please start the Ollama service.');
    }

    const request: OllamaGenerateRequest = {
      model: options.model || this.defaultModel,
      prompt,
      stream: false,
      format: options.format || '',
      temperature: options.temperature ?? 0.7,
      ...options
    };

    try {
      const response = await fetch(`${this.baseURL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data: OllamaGenerateResponse = await response.json();
      return data.response;
    } catch (error) {
      console.error('Ollama generation failed:', error);
      throw new Error(`Ollama generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate with JSON format output
   * Ensures the model returns valid JSON
   */
  async generateJSON<T>(prompt: string, model?: string): Promise<T> {
    const response = await this.generate(prompt, {
      format: 'json',
      model: model || this.defaultModel,
      temperature: 0.1 // Low temperature for consistent JSON
    });

    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse Ollama JSON response:', response);
      throw new Error('Ollama returned invalid JSON');
    }
  }

  /**
   * Get available Ollama models
   */
  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseURL}/api/tags`);
      if (!response.ok) return [];

      const data: any = await response.json();
      return data.models?.map((m: any) => m.name) || [];
    } catch {
      return [];
    }
  }

  /**
   * Check if Ollama is available
   */
  isServiceAvailable(): boolean {
    return this.isAvailable;
  }

  /**
   * Set default model
   */
  setDefaultModel(model: string): void {
    this.defaultModel = model;
  }

  /**
   * Get default model
   */
  getDefaultModel(): string {
    return this.defaultModel;
  }
}

export const ollamaClient = new OllamaClient();
