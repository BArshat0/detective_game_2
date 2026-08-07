import { Type } from "@google/genai";

export const CASE_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    title: { type: Type.STRING },
    topic: { type: Type.STRING },
    difficulty: { type: Type.STRING },
    status: { type: Type.STRING },
    tag: { type: Type.STRING },
    threatActor: { type: Type.STRING },
    timeLimit: { type: Type.STRING },
    imageUrl: { type: Type.STRING },
    introduction: { type: Type.STRING },
    storyIntro: {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING },
        victimName: { type: Type.STRING },
        victimRole: { type: Type.STRING },
        incidentTime: { type: Type.STRING },
        scenes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              sceneNumber: { type: Type.INTEGER },
              title: { type: Type.STRING },
              locationName: { type: Type.STRING },
              mediaType: { type: Type.STRING },
              narration: { type: Type.STRING },
              dialogueText: { type: Type.STRING },
              keyTakeaway: { type: Type.STRING }
            },
            required: ["id", "sceneNumber", "title"]
          }
        }
      },
      required: ["summary", "victimName", "victimRole", "incidentTime", "scenes"]
    },
    learningObjectives: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    warningSigns: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    manipulationTechniques: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    evidences: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          type: { type: Type.STRING },
          description: { type: Type.STRING },
          content: { type: Type.STRING },
          isLocked: { type: Type.BOOLEAN },
          unlockCondition: { type: Type.STRING },
          dateCollected: { type: Type.STRING },
          source: { type: Type.STRING },
          category: { type: Type.STRING },
          importance: { type: Type.STRING }
        },
        required: ["id", "name", "type", "description", "content", "isLocked"]
      }
    },
    witnesses: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          role: { type: Type.STRING },
          avatar: { type: Type.STRING },
          description: { type: Type.STRING },
          promptKnowledge: { type: Type.STRING },
          status: { type: Type.STRING }
        },
        required: ["id", "name", "role", "avatar", "description", "promptKnowledge", "status"]
      }
    },
    timeline: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          time: { type: Type.STRING },
          description: { type: Type.STRING },
          isCorrect: { type: Type.BOOLEAN },
          orderIndex: { type: Type.INTEGER }
        },
        required: ["id", "time", "description", "isCorrect", "orderIndex"]
      }
    },
    clues: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          text: { type: Type.STRING },
          evidenceId: { type: Type.STRING },
          isDiscovered: { type: Type.BOOLEAN }
        },
        required: ["id", "text", "isDiscovered"]
      }
    },
    solution: {
      type: Type.OBJECT,
      properties: {
        questions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              choices: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["id", "question", "choices", "correctAnswer", "explanation"]
          }
        }
      },
      required: ["questions"]
    },
    location: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        description: { type: Type.STRING },
        coordinates: { type: Type.STRING },
        imageUrl: { type: Type.STRING },
        hotspots: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              x: { type: Type.NUMBER },
              y: { type: Type.NUMBER },
              description: { type: Type.STRING },
              revealsEvidenceId: { type: Type.STRING }
            },
            required: ["id", "name", "x", "y", "description"]
          }
        }
      },
      required: ["name", "description", "coordinates", "imageUrl", "hotspots"]
    }
  },
  required: [
    "id", "title", "topic", "difficulty", "status", "tag", "threatActor",
    "timeLimit", "imageUrl", "introduction", "learningObjectives",
    "warningSigns", "manipulationTechniques", "evidences", "witnesses",
    "timeline", "clues", "solution", "location"
  ]
};
