/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { Agenda } from "../lib/types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeDocument(fileBase64: string, mimeType: string): Promise<Agenda> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze the uploaded document and extract a detailed meeting agenda.
    Identify:
    1. A clear title for the meeting.
    2. Key stakeholders and their roles.
    3. Specific agenda topics with descriptions and estimated duration in minutes.
    
    Ensure the agenda is logical, time-efficient, and covers the primary goals of the document.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: fileBase64,
              mimeType: mimeType
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          stakeholders: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                role: { type: Type.STRING }
              },
              required: ["name", "role"]
            }
          },
          topics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                durationMinutes: { type: Type.NUMBER },
                speaker: { type: Type.STRING }
              },
              required: ["title", "description", "durationMinutes"]
            }
          }
        },
        required: ["title", "stakeholders", "topics"]
      }
    }
  });

  const agenda = JSON.parse(response.text || "{}") as Agenda;
  
  // Calculate IDs and total duration
  agenda.topics = agenda.topics.map((topic, index) => ({
    ...topic,
    id: `topic-${index}`
  }));
  
  agenda.totalDuration = agenda.topics.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  
  return agenda;
}
