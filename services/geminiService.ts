
import { GoogleGenAI } from "@google/genai";
import { Goal, Memo, User } from "../types";

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

export const queryKnowledgeBase = async (query: string, goals: Goal[], memos: Memo[], users: User[]): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "AI Service Unavailable";

  // Helper to resolve names
  const getUserName = (id: string) => users.find(u => u.id === id)?.name || id;

  // Enrich Data with Names
  const enrichedGoals = goals.map(g => ({
    title: g.title,
    owner: getUserName(g.ownerId),
    status: g.status,
    progress: `${g.current}/${g.target} ${g.metric}`,
    comments: g.comments?.map(c => `${getUserName(c.authorId)}: ${c.text}`).join(' | ')
  }));

  const enrichedMemos = memos.map(m => ({
    subject: m.subject,
    from: getUserName(m.fromId),
    to: m.toId === 'ALL' ? 'Leadership Team' : getUserName(m.toId),
    date: m.date,
    summary: m.summary,
    status: m.status
  }));

  const context = `
    You are an intelligent assistant for GRX10, a company focusing on renewable energy and marketing.
    You have access to the company's internal goals, memos, and related tasks.
    
    Interpret "tasks" or "action items" by looking for:
    1. The "Ask" or "Solution" section in Memos (Memos are requests for action).
    2. Explicit questions or requests in Goal Comments.
    
    CURRENT GOALS DATABASE:
    ${JSON.stringify(enrichedGoals, null, 2)}

    CURRENT MEMOS DATABASE:
    ${JSON.stringify(enrichedMemos, null, 2)}

    USER QUESTION: "${query}"

    Answer the user's question based STRICTLY on the provided data. 
    If the answer isn't in the data, say so. 
    Be concise and helpful.
    When referring to people, use their names.
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
