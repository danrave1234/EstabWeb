const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;

if (!APIFY_API_TOKEN) {
    console.warn("APIFY_API_TOKEN is not set in environment variables. Apify scraper will fail.");
}

export interface ScrapedData {
    url: string;
    text: string;
    title?: string;
    description?: string;
    logoUrl?: string;
    heroImageUrl?: string;
    email?: string;
    phone?: string;
    location?: string;
    recentPosts?: { text: string; imageUrl: string }[];
}

export async function scrapeUrlWithApify(url: string): Promise<ScrapedData | null> {
    try {
        console.log(`Starting Apify scrape via REST for: ${url}`);
        
        if (!APIFY_API_TOKEN) {
            console.error("Missing Apify token.");
            return null;
        }

        const isFacebook = /facebook\.com/i.test(url);
        
        if (isFacebook) {
            const input = { startUrls: [{ url }], resultsLimit: 1 };
            
            const res = await fetch(`https://api.apify.com/v2/acts/apify~facebook-pages-scraper/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(input)
            });

            if (!res.ok) {
                console.error("Apify API error:", await res.text());
                return null;
            }

            const items = await res.json();
            if (items && items.length > 0) {
                const fbData = items[0] as any;
                
                const textContext = `
Facebook Page: ${fbData.title || fbData.pageName || ''}
About: ${fbData.about || fbData.description || ''}
Category: ${fbData.categories?.join(', ') || ''}
Likes: ${fbData.likes || 0}
Website: ${fbData.website || ''}

Recent Posts Context:
${(fbData.posts || []).slice(0, 15).map((p: any) => `- ${p.text}`).join('\n')}
                `.trim();

                const recentPosts = (fbData.posts || []).slice(0, 15).map((p: any) => ({
                    text: p.text || '',
                    imageUrl: p.images?.[0]?.url || p.postImageUrl || ''
                })).filter((p: any) => p.text || p.imageUrl);

                return {
                    url,
                    text: textContext,
                    title: fbData.title || fbData.pageName || '',
                    description: fbData.about || fbData.description || '',
                    logoUrl: fbData.profilePictureUrl || fbData.profilePic || '',
                    heroImageUrl: fbData.coverPhotoUrl || fbData.coverPhoto || '',
                    email: fbData.email || '',
                    phone: fbData.phone || '',
                    location: fbData.address ? `${fbData.address.street || ''}, ${fbData.address.city || ''}`.trim() : '',
                    recentPosts
                };
            }
        }

        const input = {
            startUrls: [{ url }],
            maxCrawlPages: 1,
            crawlerType: 'playwright:adaptive',
            dynamicContentWaitSecs: 5,
        };

        const res = await fetch(`https://api.apify.com/v2/acts/apify~website-content-crawler/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input)
        });

        if (!res.ok) {
            console.error("Apify API error:", await res.text());
            return null;
        }

        const items = await res.json();
        if (items && items.length > 0) {
            const result = items[0] as any;
            return {
                url,
                text: result.markdown || result.text || '',
                title: result.metadata?.title || '',
                description: result.metadata?.description || '',
            };
        }

        return null;
    } catch (error) {
        console.error('Apify scraping error:', error);
        return null;
    }
}
