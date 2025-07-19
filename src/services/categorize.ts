
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

export async function suggestCategory(description: string, categories: any): Promise<{ category: string, subCategory: string }> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  const prompt = `
    Given the following transaction description, suggest a category and sub-category from the provided list.
    Description: "${description}"
    Categories: ${JSON.stringify(categories, null, 2)}
    Respond with a JSON object with the keys "category" and "subCategory".
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    const jsonResponse = JSON.parse(text);
    return jsonResponse;
  } catch (error) {
    console.error("Error suggesting category:", error);
    return { category: '', subCategory: '' };
  }
}
