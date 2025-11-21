
import { GoogleGenAI } from "@google/genai";
import { Goal, Memo } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const critiqueMemo = async (memo: Partial<Memo>): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "AI Service Unavailable: Missing API Key";

  const prompt = `
    Act as a brutally honest executive at Cypress Semiconductor or Amazon. 
    Review this memo for clarity, brevity, and ROI focus. 
    The culture demands "No Fluff".
    
    Subject: ${memo.subject || ''}
    Summary & Content: ${memo.summary || ''}
    Attachments: ${memo.attachments?.map(a => a.name).join(', ') || 'None'}

    Provide a short, bulleted critique on how to improve this memo to be more quantitative and direct.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No feedback generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating critique.";
  }
};

export const optimizeGoal = async (goalDescription: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "AI Service Unavailable";

  const prompt = `
    Refine the following goal to be strictly SMART (Specific, Measurable, Achievable, Relevant, Time-bound).
    It must have a numeric baseline and a numeric target.
    
    Current Draft: "${goalDescription}"
    
    Output a suggested Title, Metric, Baseline (number), and Target (number) in a concise format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No suggestion generated.";
  } catch (error) {
    return "Error generating goal suggestion.";
  }
};

export const queryKnowledgeBase = async (query: string, goals: Goal[], memos: Memo[]): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "AI Service Unavailable";

  const context = `
    You are an intelligent assistant for GRX10, a company focusing on renewable energy and marketing.
    You have access to the company's internal goals and memos database.
    
    CURRENT GOALS DATABASE:
    ${JSON.stringify(goals.map(g => ({ title: g.title, owner: g.ownerId, status: g.status, progress: `${g.current}/${g.target} ${g.metric}` })))}

    CURRENT MEMOS DATABASE:
    ${JSON.stringify(memos.map(m => ({ subject: m.subject, author: m.fromId, date: m.date, summary: m.summary })))}

    USER QUESTION: "${query}"

    Answer the user's question based STRICTLY on the provided data. 
    If the answer isn't in the data, say so. 
    Be concise and helpful.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: context,
    });
    return response.text || "I couldn't find an answer to that.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Sorry, I'm having trouble accessing the knowledge base right now.";
  }
};
