// app/api/generator/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { 
            shopName, 
            keywords, 
            colors, 
            sizes, 
            materials, 
            holiday, 
            personalization, 
            extraItems 
        } = body;

        // Function to generate content for each request type
        const generateContent = async (content: string) => {
            return await openai.chat.completions.create({
                messages: [{ role: "user", content }],
                model: "gpt-3.5-turbo",
            });
        };

        // Generate titles, descriptions, and keywords
        const titlePromiseEtsy = generateContent(`Generate an optimized title for Etsy targeting the search words: ${keywords}. Etsy titles can be up to 140 characters long. It's important to use this space wisely to include critical keywords without making the title feel cluttered or spammy. The product is made from ${materials}.`);


        const [titleResponseEtsy] = await Promise.all([
            titlePromiseEtsy
        ]);


        // Extract text from responses
        const titlesEtsy = titleResponseEtsy.choices[0].message.content;

        const descriptionPromiseEtsy = generateContent(`Generate a comprehensive description for an Etsy listing titled ${titlesEtsy}, targeting the search words: ${keywords}. The shop name is ${shopName}. Use emojis if possible. The product has the following details: color(s):${colors}; size(s):${sizes}; material(s):${materials}; holiday(s):${holiday}; personalization info:${personalization}; extra items included:${extraItems};`);
        const keywordPromiseEtsy = generateContent(`Generate optimized Etsy tags for a listing titled ${titlesEtsy} that are less than 19 characters as a comma separated list of 13 tags (not numbered please), targeting the search words: ${keywords}.`);

        const [descriptionResponseEtsy, keywordResponseEtsy] = await Promise.all([
            descriptionPromiseEtsy,
            keywordPromiseEtsy
        ]);

        const descriptionsEtsy = descriptionResponseEtsy.choices[0].message.content;
        const keywordsGeneratedEtsy = keywordResponseEtsy.choices[0].message.content;

        // Construct and send the response
        return new NextResponse(JSON.stringify({
            titlesEtsy,
            descriptionsEtsy,
            keywordsEtsy: keywordsGeneratedEtsy
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
