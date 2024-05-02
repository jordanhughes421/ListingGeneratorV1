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
        const titlePromiseEtsy = generateContent(`Generate an optimized title for an Amazon targeting the search words: ${keywords}. Etsy titles can be up to 200 characters long. This limit includes spaces and punctuation. Sellers are encouraged to use this space wisely to include important keywords and product features, while also making the title clear and easy to read for potential buyers. The product is made from ${materials}.`);


        const [titleResponseEtsy] = await Promise.all([
            titlePromiseEtsy
        ]);


        // Extract text from responses
        const titlesEtsy = titleResponseEtsy.choices[0].message.content;

        const bulletPromiseEtsy = generateContent(`Generate 5 concise SEO optimized bullet points (less than 475 characters) for an Amazon listing titled ${titlesEtsy}, targeting the search words: ${keywords}. The shop name is ${shopName}. The product has the following details: color(s):${colors}; size(s):${sizes}; material(s):${materials}; holiday(s):${holiday}; personalization info:${personalization}; extra items included:${extraItems};`);

        const descriptionPromiseEtsy = generateContent(`Generate a comprehensive SEO optimized description for an Amazon listing titled ${titlesEtsy}, targeting the search words: ${keywords}. The shop name is ${shopName}. The product has the following details: color(s):${colors}; size(s):${sizes}; material(s):${materials}; holiday(s):${holiday}; personalization info:${personalization}; extra items included:${extraItems};`);
        const keywordPromiseEtsy = generateContent(`Generate optimized backend search terms for an Amazon listing titled ${titlesEtsy}. Please provide a comma-separated list of keywords, each less than 50 characters, totaling up to 250 characters (Amazon's limit for search terms). These terms should target the search words: ${keywords}, ensuring they are highly relevant to the product and likely to be used by potential buyers in their searches.`);

        const [descriptionResponseEtsy, keywordResponseEtsy, bulletResponseEtsy] = await Promise.all([
            descriptionPromiseEtsy,
            keywordPromiseEtsy, 
            bulletPromiseEtsy
        ]);
        let descriptionsEtsy: string = '';

        if (bulletResponseEtsy && descriptionResponseEtsy &&
            bulletResponseEtsy.choices && descriptionResponseEtsy.choices &&
            bulletResponseEtsy.choices.length > 0 && descriptionResponseEtsy.choices.length > 0 &&
            bulletResponseEtsy.choices[0].message && descriptionResponseEtsy.choices[0].message &&
            typeof bulletResponseEtsy.choices[0].message.content === 'string' &&
            typeof descriptionResponseEtsy.choices[0].message.content === 'string') {
        
            // Concatenate the content from the first choice of each response
            descriptionsEtsy = '<strong>Bullet Points:</strong> ' + bulletResponseEtsy.choices[0].message.content + '<br></br> <strong>Description:</strong> ' + descriptionResponseEtsy.choices[0].message.content;
        
            //console.log(descriptionsEtsy); // Output the combined string
        } else {
            console.log("Invalid response structure or content missing");
        }
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
