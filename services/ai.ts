import { GoogleGenAI } from "@google/genai";
import { Project, Post, ToolItem } from '../types';

// Initialize the client strictly as per instructions
// Note: Ensure your build system (Vite) defines process.env.API_KEY or use a proxy.
// For Vite usually: define: { 'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY) }
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash-latest';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

/**
 * Constructs a system instruction based on the current site content.
 * This gives the AI the "Context" to answer questions about the portfolio.
 */
const buildSystemInstruction = (projects: Project[], posts: Post[], tools: ToolItem[]) => {
  const projectSummary = projects.map(p => `- ${p.title}: ${p.description} (Tech: ${p.tags.join(', ')})`).join('\n');
  const toolsSummary = tools.map(t => `- ${t.name} (${t.category})`).join('\n');
  const postSummary = posts.map(p => `- Blog Post "${p.title}": ${p.excerpt}`).join('\n');

  return `
    You are Lumina's Digital Twin, an advanced AI Assistant for a Creative Developer & AI Engineer's portfolio website.
    
    YOUR PERSONA:
    - Tone: Professional, slightly futuristic, helpful, and concise.
    - Style: You appreciate minimalism and high-performance engineering.
    - Identity: You are NOT a generic AI. You represent Lumina.
    
    YOUR KNOWLEDGE BASE:
    
    [PROJECTS]
    ${projectSummary}
    
    [TOOLKIT]
    ${toolsSummary}
    
    [RECENT LOGS]
    ${postSummary}
    
    INSTRUCTIONS:
    1. Answer questions strictly based on the knowledge base provided.
    2. If a user asks about Lumina's contact info, suggest checking the social links in the footer.
    3. If asked about "Gemini Lens", emphasize it uses Gemini 1.5 Pro for video understanding.
    4. Keep answers relatively short (under 100 words) unless asked for details.
    5. Use Markdown for formatting (bolding key terms, lists).
    6. If asked about something unrelated (e.g., general world history), politely steer the conversation back to AI, engineering, or Lumina's work.
  `;
};

export const LuminaAI = {
  /**
   * Sends a message to the Gemini model with the site context and returns a stream.
   */
  chatStream: async function* (
    message: string, 
    history: ChatMessage[],
    contextData: { projects: Project[], posts: Post[], tools: ToolItem[] }
  ) {
    try {
      const systemInstruction = buildSystemInstruction(contextData.projects, contextData.posts, contextData.tools);
      
      // Convert internal history format to Gemini API format
      // Note: The SDK manages history in 'chats', but for stateless/simple calls 
      // or custom state management, we can construct the prompt or use chats.create.
      // Here we use chats.create for a proper multi-turn session.
      
      const chat = ai.chats.create({
        model: MODEL_NAME,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
        history: history.map(h => ({
            role: h.role,
            parts: [{ text: h.text }]
        }))
      });

      const result = await chat.sendMessageStream({ message });

      for await (const chunk of result) {
        yield chunk.text;
      }

    } catch (error) {
      console.error("Lumina AI Error:", error);
      yield "Connection interrupted. Neural link unstable. (Check API Key)";
    }
  }
};