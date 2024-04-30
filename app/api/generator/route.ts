// app/api/generator/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { keywords } = body;

        // Function to generate content for each request type
        const generateContent = async (content: string) => {
            return await openai.chat.completions.create({
                messages: [{ role: "user", content }],
                model: "gpt-3.5-turbo",
            });
        };

        // Generate titles, descriptions, and keywords
        const titlePromise = generateContent(`Generate an optimized title for: ${keywords}`);
        const descriptionPromise = generateContent(`Generate a comprehensive description for: ${keywords}`);
        const keywordPromise = generateContent(`Generate optimized keywords for: ${keywords}`);

        const [titleResponse, descriptionResponse, keywordResponse] = await Promise.all([
            titlePromise,
            descriptionPromise,
            keywordPromise
        ]);

        // Extract text from responses
        const titles = titleResponse.choices[0].message.content;
        const descriptions = descriptionResponse.choices[0].message.content;
        const keywordsGenerated = keywordResponse.choices[0].message.content;

        // Construct and send the response
        return new NextResponse(JSON.stringify({
            titles,
            descriptions,
            keywords: keywordsGenerated
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Failed to generate content:', error);
            return new NextResponse(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
        return new NextResponse(JSON.stringify({ message: 'An unexpected error occurred' }), {
          status: 500
        });
      }
    }
}
