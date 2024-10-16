import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(request: Request) {
  try {
    const { analysisData } = await request.json();

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-exp-0827" });

    // Prepare the prompt
    const prompt = `Analyze the following gold loss data and provide insights:
    ${JSON.stringify(analysisData, null, 2)}
    
    Please identify:
    1. Any anomalies in loss percentages
    2. Karigars with increasing losses over time
    3. Processes with higher than average losses
    4. Any other notable patterns or trends`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ insights: text });
  } catch (error) {
    console.error('Error in AI analytics:', error);
    return NextResponse.json({ error: 'An error occurred while generating insights' }, { status: 500 });
  }
}
