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
    pagePhotos?: string[];
    about?: string;
    categories?: string[];
    website?: string;
    likes?: number;
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
            const pagesInput = { startUrls: [{ url }] };
            const postsInput = { startUrls: [{ url }], resultsLimit: 15 };
            
            const [pagesRes, postsRes] = await Promise.all([
                fetch(`https://api.apify.com/v2/acts/apify~facebook-pages-scraper/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(pagesInput)
                }),
                fetch(`https://api.apify.com/v2/acts/apify~facebook-posts-scraper/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(postsInput)
                }).catch(err => {
                    console.error("Posts scraper failed:", err);
                    return null;
                })
            ]);

            if (!pagesRes.ok) {
                console.error("Apify API error:", await pagesRes.text());
                return null;
            }

            const pagesItems = await pagesRes.json();
            let postsItems: any[] = [];
            if (postsRes && postsRes.ok) {
                try {
                    postsItems = await postsRes.json();
                } catch (e) {
                    console.error("Failed to parse posts items:", e);
                }
            }

            if (pagesItems && pagesItems.length > 0) {
                const fbData = pagesItems[0] as any;
                
                const recentPosts = postsItems.map((p: any) => {
                    let imageUrl = '';
                    const mediaArray = p.images || p.media || [];
                    
                    // Prefer actual photos over video thumbnails
                    const photoMedia = mediaArray.find((m: any) => m.is_playable !== true && m.__typename !== 'Video');
                    
                    const extractBestImage = (media: any) => {
                        if (!media) return '';
                        let bestUrl = '';
                        let maxArea = 0;
                        const findBest = (obj: any) => {
                            if (!obj || typeof obj !== 'object') return;
                            if (Array.isArray(obj)) {
                                obj.forEach(findBest);
                                return;
                            }
                            const url = obj.uri || obj.url || obj.source;
                            if (typeof url === 'string' && typeof obj.width === 'number' && typeof obj.height === 'number') {
                                const area = obj.width * obj.height;
                                if (area > maxArea) {
                                    maxArea = area;
                                    bestUrl = url;
                                }
                            }
                            for (const key of Object.keys(obj)) {
                                if (typeof obj[key] === 'object') findBest(obj[key]);
                            }
                        };
                        findBest(media);
                        return bestUrl || media.image?.uri || media.thumbnail || media.url || '';
                    };
                    
                    if (photoMedia) {
                        imageUrl = extractBestImage(photoMedia);
                    } else if (mediaArray.length > 0) {
                        imageUrl = extractBestImage(mediaArray[0]);
                    }
                    
                    return {
                        text: p.text || '',
                        imageUrl
                    };
                }).filter((p: any) => p.text || p.imageUrl);

                const textContext = `
Facebook Page: ${fbData.title || fbData.pageName || ''}
About: ${fbData.intro || fbData.about || fbData.description || ''}
Category: ${fbData.categories?.join(', ') || ''}
Likes: ${fbData.likes || fbData.followers || 0}
Website: ${fbData.website || (fbData.websites && fbData.websites[0]) || ''}

Recent Posts Context:
${recentPosts.slice(0, 15).map((p: any) => `- ${p.text}`).join('\n')}
                `.trim();

                const pagePhotos: string[] = [];
                for (const p of postsItems) {
                    const mediaArray = p.images || p.media || [];
                    for (const media of mediaArray) {
                        // Be smart: Exclude videos so the gallery only has real photos
                        if (media.is_playable === true || media.__typename === 'Video') continue;

                        const extractBestImage = (media: any) => {
                            if (!media) return '';
                            let bestUrl = '';
                            let maxArea = 0;
                            const findBest = (obj: any) => {
                                if (!obj || typeof obj !== 'object') return;
                                if (Array.isArray(obj)) {
                                    obj.forEach(findBest);
                                    return;
                                }
                                const url = obj.uri || obj.url || obj.source;
                                if (typeof url === 'string' && typeof obj.width === 'number' && typeof obj.height === 'number') {
                                    const area = obj.width * obj.height;
                                    if (area > maxArea) {
                                        maxArea = area;
                                        bestUrl = url;
                                    }
                                }
                                for (const key of Object.keys(obj)) {
                                    if (typeof obj[key] === 'object') findBest(obj[key]);
                                }
                            };
                            findBest(media);
                            return bestUrl || media.image?.uri || media.thumbnail || media.url || '';
                        };

                        const photoUrl = extractBestImage(media);
                        if (photoUrl && !pagePhotos.includes(photoUrl)) {
                            pagePhotos.push(photoUrl);
                        }
                    }
                }

                let location = '';
                if (typeof fbData.address === 'string') {
                    location = fbData.address.trim();
                } else if (fbData.address && typeof fbData.address === 'object') {
                    location = `${fbData.address.street || ''}, ${fbData.address.city || ''}`.trim().replace(/^,\s*/, '');
                }

                return {
                    url,
                    text: textContext,
                    title: fbData.title || fbData.pageName || '',
                    description: fbData.intro || fbData.about || fbData.description || '',
                    logoUrl: fbData.profilePictureUrl || fbData.profilePic || '',
                    heroImageUrl: fbData.coverPhotoUrl || fbData.coverPhoto || '',
                    email: fbData.email || '',
                    phone: fbData.phone || '',
                    location,
                    recentPosts,
                    pagePhotos: pagePhotos.slice(0, 20),
                    about: fbData.intro || fbData.about || fbData.description || '',
                    categories: fbData.categories || [],
                    website: fbData.website || (fbData.websites && fbData.websites[0]) || '',
                    likes: fbData.likes || fbData.followers || 0,
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
