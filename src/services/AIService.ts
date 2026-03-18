// AI Service for integrating with real AI models
import { AI_CONFIG } from '../config/aiConfig';
import { MICRO_TASK_KB, MicroTaskDoc } from '../rag/microTaskKB';

export interface AIResponse {
  text: string;
  isError: boolean;
  errorMessage?: string;
}

export class AIService {
  private static instance: AIService;

  // Cached embeddings for RAG micro-task knowledge base
  private microTaskEmbeddings: { [id: string]: number[] } | null = null;

  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Main method with fallback chain: Gemini → Mistral → OpenAI → Free Models → Simulated
  public async getAIResponse(
    message: string, 
    userContext: any,
    conversationHistory: any[]
  ): Promise<AIResponse> {
    try {
      // 0. Try Google Gemini (if API key available)
      if (AI_CONFIG.GOOGLE_API_KEY) {
        try {
          const response = await this.getGoogleGeminiResponse(message, userContext, conversationHistory);
          if (!response.isError) {
            console.log('✅ Using Google Gemini');
            return response;
          }
        } catch (error) {
          console.log('❌ Google Gemini failed, trying next...');
        }
      }

      // 1. Try Mistral AI first (if API key available) - PRIMARY CHOICE
      if (AI_CONFIG.MISTRAL_API_KEY) {
        try {
          const response = await this.getMistralResponse(message, userContext, conversationHistory);
          if (!response.isError) {
            console.log('✅ Using Mistral AI (Primary)');
            return response;
          }
        } catch (error) {
          console.log('❌ Mistral AI failed, trying next...');
        }
      }

          // 2. Try OpenAI (if API key available)
      if (AI_CONFIG.OPENAI_API_KEY) {
        try {
          const response = await this.getOpenAIResponse(message, userContext, conversationHistory);
          if (!response.isError) {
            console.log('✅ Using OpenAI GPT-4');
            return response;
          }
        } catch (error) {
          console.log('❌ OpenAI failed, trying next...');
        }
      }

          // 3. Try Free AI Models (Hugging Face)
      if (AI_CONFIG.HUGGINGFACE_API_KEY) {
        try {
          const response = await this.getFreeAIResponse(message, userContext, conversationHistory);
          if (!response.isError) {
            console.log('✅ Using Free AI Models (Hugging Face)');
            return response;
          }
        } catch (error) {
          console.log('❌ Free AI Models failed, trying next...');
        }
      }

          // 4. Try Completely Free Models (no API key required)
      try {
        const response = await this.getCompletelyFreeAIResponse(message, userContext, conversationHistory);
        if (!response.isError) {
          console.log('✅ Using Completely Free AI Models');
          return response;
        }
      } catch (error) {
        console.log('❌ Completely Free Models failed, using simulated...');
      }

          // 5. Fall back to simulated responses
      console.log('🎭 Using Simulated Responses');
      return this.getSimulatedResponse(message, userContext, conversationHistory);

    } catch (error) {
      console.error('All AI methods failed:', error);
      return this.getSimulatedResponse(message, userContext, conversationHistory);
    }
  }

  // Method to integrate with Mistral AI API (PRIMARY CHOICE)
  public async getMistralResponse(
    message: string, 
    userContext: any,
    conversationHistory: any[]
  ): Promise<AIResponse> {
    try {
      // Real Mistral AI API call
      const response = await fetch(AI_CONFIG.MISTRAL_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AI_CONFIG.MISTRAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: AI_CONFIG.MISTRAL_MODEL,
          messages: [
            {
              role: 'system',
              content: this.buildSystemPrompt(userContext)
            },
            ...conversationHistory.map(msg => ({
              role: msg.isUser ? 'user' : 'assistant',
              content: msg.text
            })),
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: AI_CONFIG.MAX_TOKENS,
          temperature: AI_CONFIG.TEMPERATURE,
        }),
      });

      if (!response.ok) {
        throw new Error(`Mistral API request failed: ${response.status}`);
      }

      const data = await response.json();
      return {
        text: data.choices[0].message.content,
        isError: false
      };

    } catch (error) {
      console.error('Mistral AI API Error:', error);
      return {
        text: '',
        isError: true,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }


  // Alternative: Use OpenAI API as fallback
  public async getOpenAIResponse(
    message: string, 
    userContext: any,
    conversationHistory: any[]
  ): Promise<AIResponse> {
    try {
      const response = await fetch(AI_CONFIG.OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AI_CONFIG.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: AI_CONFIG.OPENAI_MODEL,
          messages: [
            {
              role: 'system',
              content: this.buildSystemPrompt(userContext)
            },
            ...conversationHistory.map(msg => ({
              role: msg.isUser ? 'user' : 'assistant',
              content: msg.text
            })),
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: AI_CONFIG.MAX_TOKENS,
          temperature: AI_CONFIG.TEMPERATURE,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API request failed: ${response.status}`);
      }

      const data = await response.json();
      return {
        text: data.choices[0].message.content,
        isError: false
      };

    } catch (error) {
      console.error('OpenAI API Error:', error);
      return {
        text: '',
        isError: true,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Google Gemini (Google AI Studio) integration
  public async getGoogleGeminiResponse(
    message: string,
    userContext: any,
    conversationHistory: any[]
  ): Promise<AIResponse> {
    try {
      const systemPrompt = this.buildSystemPrompt(userContext);
      const conversationText = conversationHistory
        .map(msg => `${msg.isUser ? 'User' : 'Assistant'}: ${msg.text}`)
        .join('\n');

      const fullPrompt = `${systemPrompt}\n\nConversation History:\n${conversationText}\n\nUser: ${message}\nAssistant:`;

      const response = await fetch(
        `${AI_CONFIG.GOOGLE_API_URL}/${AI_CONFIG.GOOGLE_GEMINI_MODEL}:generateContent?key=${AI_CONFIG.GOOGLE_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: fullPrompt }],
              },
            ],
            generationConfig: {
              maxOutputTokens: AI_CONFIG.MAX_TOKENS,
              temperature: AI_CONFIG.TEMPERATURE,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Google Gemini API request failed: ${response.status}`);
      }

      const data = await response.json();

      const candidates = data.candidates || [];
      const firstCandidate = candidates[0];
      const parts = firstCandidate?.content?.parts || firstCandidate?.content || [];
      const firstPart = Array.isArray(parts) ? parts[0] : parts;
      const text =
        (firstPart && (firstPart.text || firstPart.generated_text)) ||
        data.output_text ||
        '';

      if (!text) {
        throw new Error('Google Gemini returned empty response');
      }

      return {
        text: text.trim(),
        isError: false,
      };
    } catch (error) {
      console.error('Google Gemini API Error:', error);
      return {
        text: '',
        isError: true,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Fallback simulated responses (current implementation)
  public getSimulatedResponse(message: string, userContext: any, conversationHistory: any[] = []): AIResponse {
    const lowerMessage = message.toLowerCase();

    // Special handling: simulate structured micro-task generation used by TodayGoalsTracking
    if (
      lowerMessage.includes('create exactly 5 specific, actionable micro-tasks') &&
      lowerMessage.includes('return format (one task per line)')
    ) {
      // Try to extract a simple goal line like "Goal: Learn Java"
      const goalMatch = message.match(/Goal:\s*(.+)/i);
      const rawGoal = goalMatch ? goalMatch[1].split('\n')[0].trim() : 'your goal';
      const goal = rawGoal.replace(/[".]+$/g, '');

      const goalLower = goal.toLowerCase();
      let text: string;

      // Learning goals
      if (goalLower.includes('learn') || goalLower.includes('study') || goalLower.includes('course')) {
        text =
`1. Outline the core topics you need for ${goal} and pick the first one - 10 min - Day 1 - easy
2. Watch or read a short intro on the first topic for ${goal} and take 3 bullet notes - 15 min - Day 1 - medium
3. Do a 15-minute practice session applying that topic for ${goal} (small exercise or example) - 15 min - Day 2 - medium
4. Review your notes for ${goal} and write 3 questions or gaps you still have - 10 min - Day 2 - easy
5. Schedule your next 2 learning blocks for ${goal} in your calendar - 15 min - Day 3 - medium`;

      // Public speaking / communication / social
      } else if (
        goalLower.includes('public speaking') ||
        goalLower.includes('presentation') ||
        goalLower.includes('speak') ||
        goalLower.includes('social') ||
        goalLower.includes('conversation')
      ) {
        text =
`1. Clarify one specific situation where you want to improve ${goal} and write it down - 10 min - Day 1 - easy
2. Write a short 2–3 minute script or outline you could use for ${goal} - 15 min - Day 1 - medium
3. Practice your script for ${goal} out loud twice, recording yourself once - 15 min - Day 2 - medium
4. Watch or listen to the recording for ${goal} and note 3 things you did well and 1 thing to improve - 10 min - Day 2 - easy
5. Schedule a low-stakes practice opportunity for ${goal} (friend, mirror, small group) - 15 min - Day 3 - medium`;

      // Fitness / health
      } else if (
        goalLower.includes('fit') ||
        goalLower.includes('exercise') ||
        goalLower.includes('workout') ||
        goalLower.includes('health') ||
        goalLower.includes('run') ||
        goalLower.includes('walk')
      ) {
        text =
`1. Decide the exact type of movement for ${goal} (walk, run, workout) and time of day - 10 min - Day 1 - easy
2. Prepare your gear for ${goal} (clothes, shoes, water, app or playlist) and place it ready - 15 min - Day 1 - medium
3. Do a short 10–15 minute session for ${goal}, staying at an easy intensity - 15 min - Day 2 - medium
4. Stretch for 5–10 minutes after ${goal} session and note how your body feels - 10 min - Day 2 - easy
5. Plan the next 2–3 sessions for ${goal} (days and times) and add them to your calendar - 15 min - Day 3 - medium`;

      // Career / job / project
      } else if (
        goalLower.includes('job') ||
        goalLower.includes('career') ||
        goalLower.includes('project') ||
        goalLower.includes('portfolio') ||
        goalLower.includes('resume') ||
        goalLower.includes('cv')
      ) {
        text =
`1. Write a one-sentence definition of what success looks like for ${goal} - 10 min - Day 1 - easy
2. Break ${goal} into 3–5 chunks (research, planning, execution) and choose the first chunk - 15 min - Day 1 - medium
3. Spend 15 minutes doing only the first chunk for ${goal} (no multitasking) - 15 min - Day 2 - medium
4. Capture 3 insights or next steps you discovered while working on ${goal} - 10 min - Day 2 - easy
5. Block a 30-minute focus session in your calendar to continue ${goal} this week - 15 min - Day 3 - medium`;

      // Default generic breakdown
      } else {
        text =
`1. Clarify the first small step for ${goal} and write it down - 10 min - Day 1 - easy
2. Prepare the environment or resources you need to work on ${goal} (apps, notes, tools) - 15 min - Day 1 - medium
3. Do a focused 15-minute session working only on the next tiny part of ${goal} - 15 min - Day 2 - medium
4. Review what you did for ${goal}, write 3 quick learnings, and adjust your next step - 10 min - Day 2 - easy
5. Schedule and commit to your next focused block for ${goal} in your calendar - 15 min - Day 3 - medium`;
      }

      return {
        text,
        isError: false
      };
    }
    
    // Crisis detection
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'self harm', 'hopeless', 'worthless', 'no point'];
    if (crisisKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return {
        text: "I'm really concerned about what you just shared. Your life matters, and I want to make sure you get the support you need right now. Please reach out to a crisis hotline or emergency contact immediately.",
        isError: false
      };
    }

    // Context-aware responses - check conversation history
    const recentMessages = conversationHistory.slice(-4).map(m => m.text?.toLowerCase() || '');
    const allConversation = recentMessages.join(' ');
    
    // Check for context about feeling low
    if (lowerMessage.includes('feeling low') || lowerMessage.includes('sad') || lowerMessage.includes('depressed')) {
      // Check if user mentioned wanting to complete tasks
      const wantsToCompleteTask = recentMessages.some(m => m.includes('task') || m.includes('complete') || m.includes('goal'));
      
      if (wantsToCompleteTask) {
        return {
          text: `I can feel that low energy, ${userContext?.name}. Sometimes taking action helps shift that mood. What task feels most doable right now? Even something tiny - let's start there together.`,
          isError: false
        };
      }
      
      return {
        text: `That low feeling is real, ${userContext?.name}. You're not alone in this. What's one small thing that might help you feel even slightly better right now? A breath of fresh air? Some water? Or just acknowledging that you reached out - that took courage.`,
        isError: false
      };
    }

    // Check for wanting to complete tasks
    if (lowerMessage.includes('task') && (lowerMessage.includes('complete') || lowerMessage.includes('want'))) {
      // Check if user mentioned feeling low before
      const wasFeelingLow = recentMessages.some(m => m.includes('low') || m.includes('sad') || m.includes('down'));
      
      if (wasFeelingLow) {
        return {
          text: `I love that you're turning to action, ${userContext?.name}. That's powerful. Let's pick ONE specific task - what feels most important to you right now? We'll break it into tiny steps so it feels achievable.`,
          isError: false
        };
      }
      
      return {
        text: `Great! Let's get this done, ${userContext?.name}. What task are you thinking about? Once you tell me, we'll create a simple plan to finish it today. What is it?`,
        isError: false
      };
    }

    // Context-aware responses
    if (lowerMessage.includes('overwhelmed') || lowerMessage.includes('stressed')) {
      return {
        text: `I hear the weight in those words, ${userContext?.name}. Remember your why: "${userContext?.whyStatement}". What specifically is making this feel so difficult right now?`,
        isError: false
      };
    }

    if (lowerMessage.includes('anxiety') || lowerMessage.includes('nervous')) {
      return {
        text: `That anxiety can feel so heavy. You're not alone in this, ${userContext?.name}. Here's what I'd try: Take 3 deep breaths, then tell me one small thing you can do right now to feel more grounded.`,
        isError: false
      };
    }

    if (lowerMessage.includes('social') || lowerMessage.includes('conversation')) {
      return {
        text: `Social situations can be challenging. Based on your goal to improve social confidence, here's a micro-strategy: Start with "I noticed..." instead of "what do you do?" People open up way more. Want to practice this together?`,
        isError: false
      };
    }

    if (lowerMessage.includes('habit') || lowerMessage.includes('routine')) {
      return {
        text: `Building habits is about consistency, not perfection. ${userContext?.name}, what's one tiny habit you could do for just 2 minutes today? Remember, small wins compound into big changes.`,
        isError: false
      };
    }

    if (lowerMessage.includes('procrastination') || lowerMessage.includes('procrastinating')) {
      return {
        text: `Procrastination often comes from feeling overwhelmed. RIGHT NOW: Break your task into the smallest possible step. What's the tiniest action you could take in the next 5 minutes?`,
        isError: false
      };
    }

    if (lowerMessage.includes('goal') && lowerMessage.includes('set')) {
      return {
        text: `Let's make this actionable, ${userContext?.name}! For your goal, let's use the SMART framework:\n1. SPECIFIC: What exactly? (e.g., "Complete this book")\n2. MEASURABLE: How will you track progress? (e.g., "10 pages/day")\n3. ACHIEVABLE: Is this realistic in 10 days?\n4. RELEVANT: Why does this matter to YOU?\n5. TIME-BOUND: You have 10 days - let's break this down!\n\nFor a 10-day book goal: Read 10-15% each day, take notes, create a daily reading ritual. Ready to commit?`,
        isError: false
      };
    }

    if (lowerMessage.includes('book') && (lowerMessage.includes('10 day') || lowerMessage.includes('complete'))) {
      return {
        text: `Great goal, ${userContext?.name}! Here's your 10-day plan:\n\n**Days 1-3 (Foundation):**\n- Skim the table of contents and chapter summaries first\n- Read intro and conclusion chapters\n- Identify key themes (15 minutes)\n\n**Days 4-7 (Deep Dive):**\n- Read 1-2 chapters per day (30-45 min)\n- Take notes on 3 key points per chapter\n- Create actionable takeaways\n\n**Days 8-10 (Integration):**\n- Finish remaining chapters\n- Write a 1-page summary with your insights\n- Identify 3 things you'll implement from the book\n\nPro tip: Read first thing in morning when mind is fresh! Want me to help you create this reading ritual?`,
        isError: false
      };
    }

    if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted')) {
      return {
        text: `I can hear the exhaustion in your words. Your body is asking for rest, ${userContext?.name}. What's one thing you could do to be kind to yourself right now?`,
        isError: false
      };
    }

    if (lowerMessage.includes('lonely') || lowerMessage.includes('alone')) {
      return {
        text: `Loneliness is so hard. You're reaching out, which shows courage. Remember, you're building connections through GrowthPath - you're not alone in wanting meaningful relationships. What's one way you could connect with someone today?`,
        isError: false
      };
    }

    // Default empathetic responses - use conversation history for better context
    let response = '';
    
    // Count how many times we've responded
    const responseCount = conversationHistory.length;
    
    if (responseCount === 0) {
      // First message
      response = `That sounds really tough, ${userContext?.name}. Tell me more - I'm really listening.`;
    } else if (responseCount === 1) {
      // Second message - avoid repetition
      if (allConversation.includes('low') || allConversation.includes('sad')) {
        response = `I can feel that weight, ${userContext?.name}. You're reaching out - that shows strength. What's on your mind right now?`;
      } else if (allConversation.includes('task')) {
        response = `Let's tackle that together. What specific task is on your mind, ${userContext?.name}?`;
      } else {
        response = `I hear you, ${userContext?.name}. What would help right now?`;
      }
    } else {
      // Continuing conversation - use full context
      const recentContext = allConversation;
      
      // Check for feeling low followed by wanting to do tasks
      if (recentContext.includes('low') && recentContext.includes('task')) {
        response = `I love that shift from low energy to action, ${userContext?.name}. That's powerful. What task feels most doable right now? Let's break it into tiny steps.`;
      } 
      // Check for tasks/goals
      else if (lowerMessage.includes('task') || lowerMessage.includes('goal')) {
        if (recentContext.includes('low')) {
          response = `Great move turning to action! What specific task are you thinking about? Let's make it simple and achievable.`;
        } else {
          response = `Let's do this! What's the task on your mind? Once you tell me, we'll create a simple plan.`;
        }
      } 
      // Check for feeling down
      else if (lowerMessage.includes('low') || lowerMessage.includes('sad') || lowerMessage.includes('down')) {
        const responses = [
          `That feeling is valid, ${userContext?.name}. What's making you feel this way?`,
          `I hear that. It's okay to feel low sometimes. What might help you feel even a tiny bit better?`,
          `Those low feelings can be overwhelming. Let's talk through this - what's happening?`
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
      }
      // Check for help requests
      else if (lowerMessage.includes('help')) {
        response = `I'm here for you, ${userContext?.name}. What specific help do you need? Let's tackle it together.`;
      } 
      // Check for "how" questions
      else if (lowerMessage.includes('how') || lowerMessage.includes('what should')) {
        response = `Let me help you with that. Can you give me more details about what you're trying to do?`;
      }
      // Generic responses with more variety
      else {
        const variedResponses = [
          `I'm following along, ${userContext?.name}. Tell me more.`,
          `That makes sense. What's next for you?`,
          `I hear you. How can I support you with this?`,
          `Got it, ${userContext?.name}. What would be helpful here?`,
          `Tell me more about that, ${userContext?.name}.`
        ];
        response = variedResponses[Math.floor(Math.random() * variedResponses.length)];
      }
    }

    return {
      text: response,
      isError: false
    };
  }

  // Build system prompt for AI
  private buildSystemPrompt(userContext: any): string {
    return `You are an empathetic AI mentor for personal growth and social confidence. You're helping ${userContext?.name || 'the user'} with their goals: ${userContext?.goals?.join(', ') || 'personal growth'}.

Your personality:
- Empathetic and understanding
- Supportive but not overly positive
- Practical and actionable
- Uses the user's name frequently
- References their "why" statement when appropriate: "${userContext?.whyStatement || 'personal growth'}"

Guidelines:
- Always be empathetic and validating
- Provide specific, actionable advice
- Reference their goals and context
- Use encouraging but realistic language
- Ask follow-up questions to help them reflect
- Give concrete steps they can take RIGHT NOW
- Celebrate small wins
- If they mention challenges, acknowledge them first, then offer solutions

Current Context:
- Name: ${userContext?.name || 'User'}
- Age: ${userContext?.age || 'Not provided'}
- Goals: ${userContext?.goals?.join(', ') || 'Personal growth'}
- Why statement: "${userContext?.whyStatement || 'Personal development'}"
- Current phase: ${userContext?.phase || 1}
- Day: ${userContext?.day || 1}

Respond as their AI mentor with specific, actionable advice.`;
  }

  // ------- RAG PIPELINE FOR MICRO-TASK GENERATION -------

  // Get an embedding vector for text using Google Gemini embeddings (text-embedding-004)
  private async getEmbedding(text: string): Promise<number[] | null> {
    if (!AI_CONFIG.GOOGLE_API_KEY) {
      return null;
    }

    try {
      const response = await fetch(
        `${AI_CONFIG.GOOGLE_API_URL}/models/text-embedding-004:embedContent?key=${AI_CONFIG.GOOGLE_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: {
              parts: [{ text }],
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini embeddings request failed: ${response.status}`);
      }

      const data = await response.json();
      const vector = data?.embedding?.values || data?.[0]?.embedding?.values;
      if (!Array.isArray(vector)) {
        throw new Error('Invalid embeddings response format');
      }
      return vector;
    } catch (error) {
      console.error('Embedding error:', error);
      return null;
    }
  }

  // Compute cosine similarity between two embedding vectors
  private cosineSimilarity(a: number[], b: number[]): number {
    const len = Math.min(a.length, b.length);
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < len; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    if (!normA || !normB) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // Ensure embeddings for the micro-task KB are computed and cached
  private async ensureMicroTaskEmbeddings(): Promise<void> {
    if (this.microTaskEmbeddings) return;

    this.microTaskEmbeddings = {};

    // If embeddings are not available, we will fall back to heuristic retrieval later
    const canEmbed = !!AI_CONFIG.GOOGLE_API_KEY;
    if (!canEmbed) {
      return;
    }

    for (const doc of MICRO_TASK_KB) {
      const text = `${doc.title}\n${doc.goalExample}\n${doc.domain}`;
      const emb = await this.getEmbedding(text);
      if (emb) {
        this.microTaskEmbeddings[doc.id] = emb;
      }
    }
  }

  // Retrieve top-K relevant micro-task documents for a user goal
  private async retrieveMicroTaskDocs(userGoal: string, k: number = 3): Promise<MicroTaskDoc[]> {
    await this.ensureMicroTaskEmbeddings();

    const embeddings = this.microTaskEmbeddings;
    // If we couldn't build embeddings (no API key), fall back to simple keyword-based ranking
    if (!embeddings || Object.keys(embeddings).length === 0) {
      const goalLower = userGoal.toLowerCase();

      const scored = MICRO_TASK_KB.map((doc) => {
        let score = 0;
        const text = `${doc.title} ${doc.goalExample}`.toLowerCase();
        if (goalLower.includes('learn') || goalLower.includes('study') || goalLower.includes('course')) {
          if (doc.domain === 'learning') score += 2;
        }
        if (goalLower.includes('speak') || goalLower.includes('presentation') || goalLower.includes('social')) {
          if (doc.domain === 'public_speaking') score += 2;
        }
        if (goalLower.includes('fit') || goalLower.includes('run') || goalLower.includes('walk') || goalLower.includes('exercise')) {
          if (doc.domain === 'fitness') score += 2;
        }
        if (goalLower.includes('job') || goalLower.includes('career') || goalLower.includes('portfolio') || goalLower.includes('project')) {
          if (doc.domain === 'career') score += 2;
        }
        if (goalLower.includes('habit') || goalLower.includes('routine')) {
          if (doc.domain === 'habit') score += 2;
        }
        if (goalLower.includes('procrastination') || goalLower.includes('procrastinate') || goalLower.includes('focus')) {
          if (doc.domain === 'productivity') score += 2;
        }
        if (text.includes(goalLower)) score += 3;
        return { doc, score };
      });

      return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, k)
        .map((s) => s.doc);
    }

    const goalEmbedding = await this.getEmbedding(userGoal);
    if (!goalEmbedding) {
      return MICRO_TASK_KB.slice(0, k);
    }

    const scored = MICRO_TASK_KB.map((doc) => {
      const emb = embeddings[doc.id];
      const sim = emb ? this.cosineSimilarity(goalEmbedding, emb) : 0;
      return { doc, sim };
    });

    return scored
      .sort((a, b) => b.sim - a.sim)
      .slice(0, k)
      .map((s) => s.doc);
  }

  // Public helper: build context text for micro-task RAG
  public async getMicroTaskRAGContext(userGoal: string): Promise<string> {
    try {
      const docs = await this.retrieveMicroTaskDocs(userGoal, 3);
      if (!docs || docs.length === 0) return '';

      return docs
        .map((doc) => {
          return `Example goal: ${doc.goalExample}\nExample micro-tasks:\n${doc.microTasks.join('\n')}`;
        })
        .join('\n\n');
    } catch (error) {
      console.error('RAG context error:', error);
      return '';
    }
  }

  // FREE AI Models from Hugging Face and others
  public async getFreeAIResponse(
    message: string, 
    userContext: any,
    conversationHistory: any[]
  ): Promise<AIResponse> {
    try {
      // Try different free models in order of preference
      const freeModels = [
        AI_CONFIG.FREE_MODELS.MISTRAL_7B,
        AI_CONFIG.FREE_MODELS.LLAMA_7B,
        AI_CONFIG.FREE_MODELS.FLAN_T5,
        AI_CONFIG.FREE_MODELS.GPT_NEO
      ];

      for (const model of freeModels) {
        try {
          const response = await this.callHuggingFaceAPI(model, message, userContext, conversationHistory);
          if (response && !response.isError) {
            return response;
          }
        } catch (error) {
          console.log(`Model ${model} failed, trying next...`);
          continue;
        }
      }

      // If all free models fail, fall back to simulated
      return this.getSimulatedResponse(message, userContext);

    } catch (error) {
      console.error('Free AI Models Error:', error);
      return this.getSimulatedResponse(message, userContext);
    }
  }

  // Call Hugging Face Inference API
  private async callHuggingFaceAPI(
    model: string,
    message: string,
    userContext: any,
    conversationHistory: any[]
  ): Promise<AIResponse> {
    try {
      const systemPrompt = this.buildSystemPrompt(userContext);
      const conversationText = conversationHistory
        .map(msg => `${msg.isUser ? 'User' : 'Assistant'}: ${msg.text}`)
        .join('\n');
      
      const fullPrompt = `${systemPrompt}\n\nConversation History:\n${conversationText}\n\nUser: ${message}\nAssistant:`;

      const response = await fetch(`${AI_CONFIG.HUGGINGFACE_API_URL}/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AI_CONFIG.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: fullPrompt,
          parameters: {
            max_new_tokens: AI_CONFIG.MAX_TOKENS,
            temperature: AI_CONFIG.TEMPERATURE,
            return_full_text: false,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle different response formats
      let responseText = '';
      if (Array.isArray(data) && data[0] && data[0].generated_text) {
        responseText = data[0].generated_text;
      } else if (data.generated_text) {
        responseText = data.generated_text;
      } else if (typeof data === 'string') {
        responseText = data;
      } else {
        throw new Error('Unexpected response format');
      }

      // Clean up the response
      responseText = responseText
        .replace(/^Assistant:\s*/i, '')
        .replace(/^User:\s*/i, '')
        .trim();

      return {
        text: responseText || "I'm having trouble processing that right now. Could you try rephrasing your message?",
        isError: false
      };

    } catch (error) {
      console.error(`Hugging Face API Error for ${model}:`, error);
      return {
        text: '',
        isError: true,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Alternative: Use completely free models without API key
  public async getCompletelyFreeAIResponse(
    message: string, 
    userContext: any,
    conversationHistory: any[]
  ): Promise<AIResponse> {
    try {
      // Use community-hosted free models
      const freeEndpoints = [
        'https://api.together.xyz/v1/chat/completions', // Together AI free tier
        'https://api.anthropic.com/v1/messages', // Claude free tier
      ];

      for (const endpoint of freeEndpoints) {
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'mistralai/Mistral-7B-Instruct-v0.1',
              messages: [
                {
                  role: 'system',
                  content: this.buildSystemPrompt(userContext)
                },
                ...conversationHistory.map(msg => ({
                  role: msg.isUser ? 'user' : 'assistant',
                  content: msg.text
                })),
                {
                  role: 'user',
                  content: message
                }
              ],
              max_tokens: AI_CONFIG.MAX_TOKENS,
              temperature: AI_CONFIG.TEMPERATURE,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            return {
              text: data.choices[0].message.content,
              isError: false
            };
          }
        } catch (error) {
          console.log(`Free endpoint ${endpoint} failed, trying next...`);
          continue;
        }
      }

      // If all free endpoints fail, fall back to simulated
      return this.getSimulatedResponse(message, userContext);

    } catch (error) {
      console.error('Completely Free AI Error:', error);
      return this.getSimulatedResponse(message, userContext);
    }
  }
}
