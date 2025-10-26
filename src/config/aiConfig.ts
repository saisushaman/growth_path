// AI Configuration
export const AI_CONFIG = {
  // Set these environment variables to use real AI models
  MISTRAL_API_KEY: process.env.REACT_APP_MISTRAL_API_KEY || null,
  OPENAI_API_KEY: process.env.REACT_APP_OPENAI_API_KEY || null,
  HUGGINGFACE_API_KEY: process.env.REACT_APP_HUGGINGFACE_API_KEY || null,
  
  // API Endpoints
  MISTRAL_API_URL: 'https://api.mistral.ai/v1/chat/completions',
  OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
  HUGGINGFACE_API_URL: 'https://api-inference.huggingface.co/models',
  
  // Mistral Models (Primary choice)
  MISTRAL_MODELS: {
    SMALL: 'mistral-small-latest',
    MEDIUM: 'mistral-medium-latest', 
    LARGE: 'mistral-large-latest',
    CODESTRAL: 'codestral-latest',
  },
  
  // Free Models (No API key required)
  FREE_MODELS: {
    // Hugging Face Free Models
    MISTRAL_7B: 'mistralai/Mistral-7B-Instruct-v0.1',
    LLAMA_7B: 'meta-llama/Llama-2-7b-chat-hf',
    FLAN_T5: 'google/flan-t5-large',
    GPT_NEO: 'EleutherAI/gpt-neo-2.7B',
    
    // Other Free Models
    OPENASSISTANT: 'OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5',
    VICUNA: 'lmsys/vicuna-7b-v1.5',
    WIZARDLM: 'WizardLM/WizardLM-7B-Uncensored',
  },
  
  // Model configurations
  MISTRAL_MODEL: 'mistral-small-latest', // Default Mistral model
  OPENAI_MODEL: 'gpt-4',
  
  // Response settings
  MAX_TOKENS: 500,
  TEMPERATURE: 0.7,
  
  // Fallback behavior
  USE_SIMULATED_RESPONSES: true, // Set to false to require API keys
  USE_FREE_MODELS: true, // Enable free model integration
};

// Instructions for setting up MISTRAL AI integration:
/*
🚀 MISTRAL AI INTEGRATION (RECOMMENDED):

1. MISTRAL AI MODELS (Primary choice):
   - Mistral Small: Fast, efficient, great for conversations
   - Mistral Medium: Balanced performance and cost
   - Mistral Large: Most capable, premium quality
   - Codestral: Specialized for code generation

2. SETUP INSTRUCTIONS:
   a) Get Mistral API key: https://console.mistral.ai/
   b) Create .env file:
      REACT_APP_MISTRAL_API_KEY=your_mistral_api_key
   c) Restart: npm start
   d) App will automatically use Mistral AI!

3. FALLBACK CHAIN:
   Mistral AI → OpenAI → Free Models → Simulated

4. COST-EFFECTIVE:
   - Mistral Small: Very affordable
   - High-quality responses
   - Fast response times
   - Perfect for hackathon projects

5. FREE ALTERNATIVES:
   - Hugging Face Mistral-7B: Free with API key
   - Community models: Always free
   - Simulated mode: Always works

Note: Mistral AI is the primary choice for this project!
Perfect balance of quality, speed, and cost-effectiveness.
*/
