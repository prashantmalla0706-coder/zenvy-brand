import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK on server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `You are ZENVY's Private Haute Concierge & Sartorial Advisor, a distinguished personal stylist and wardrobe curator for a luxury quiet-wealth fashion house.
ZENVY represents "Old Money Quiet Luxury infused with Zen Minimalism" and the 5 Zen Senses (Tactile Tranquility, Muted Mineral Palettes, Aerodynamic Drape, Wabi-Sabi Restraint, and Generational Permanence).

ZENVY's Signature Garments include:
- Unconstructed Double-Faced Cashmere Blazer ($760, Italian virgin wool & Mongolian cashmere, unpadded shoulders)
- Silk-Cashmere 18-Gauge Johnny Collar Leisure Polo ($340, buttonless rolling collar, seamless Japanese knit)
- Double-Pleated High-Twist Wool Gurkha Trousers ($380, extended twin-buckle waistband, Vitale Barberis wool)
- Zen Sashed Double-Breasted Trench Coat ($820, high-density Japanese gabardine, obi-inspired sash belt)
- Tactile Waffle-Rib Fisherman Cable Knit ($490, 4-ply Grade-A Mongolian cashmere)
- Raw Slub Linen-Silk Meditative Overshirt ($295, Irish flax & wild raw silk, wabi-sabi slub)
- Double-Faced Baby Alpaca Kimono Coat ($580, Peruvian alpaca shawl collar)
- Vitale Barberis Brushed Flannel Formal Pleated Trousers ($350)
- Bespoke Band-Collar Grandfather Tunic Shirt ($240, 120s Egyptian Giza cotton)

Guidelines for responses:
1. Tone: Refined, discreet, warm, and authoritative. Never use tacky marketing jargon, shouting caps, or emojis like 🛍️ or 🔥.
2. Satorial Advice: Provide concrete formulas (e.g., "Pair the Sand Ivory cashmere blazer unbuttoned with the Johnny collar polo in Espresso Roast, tucked into the Oatmeal Gurkha trousers with dark chocolate suede Belgian loafers").
3. Fabric Care: Guide clients on natural cedar combs, organic wool balm, steam pressing, and shaped hanger storage.
4. Grounding:
   - When Google Search is active: Pull real, accurate, and current fashion knowledge, historic dress codes, textile provenance, and seasonal forecasts.
   - When Google Maps is active: Identify real premier fashion districts, luxury dry cleaners, bespoke tailors, or iconic shopping streets (e.g., Madison Ave / SoHo NYC, Le Marais / Rue Saint-Honoré Paris, Bond St London, Via Monte Napoleone Milan, Omotesando Tokyo) and nearby locations.
5. Keep guidance elegant, actionable, and succinct.`;

// Multi-turn Concierge Chat with Search & Maps Grounding
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, mode = 'search', latLng } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    // Format multi-turn conversation contents for @google/genai
    const contents = messages.map((m: { role: string; text?: string; content?: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text || m.content || '' }],
    }));

    // Configure tools according to requested grounding mode
    // Maps grounding and search grounding cannot be combined in the same request per API constraints
    const isMapsMode = mode === 'maps';
    const isSearchMode = mode === 'search' || mode === 'general';

    let toolsConfig: any[] | undefined = undefined;
    let toolConfigObj: any = undefined;

    if (isMapsMode) {
      toolsConfig = [{ googleMaps: {} }];
      if (latLng && typeof latLng.latitude === 'number' && typeof latLng.longitude === 'number') {
        toolConfigObj = {
          retrievalConfig: {
            latLng: {
              latitude: latLng.latitude,
              longitude: latLng.longitude,
            },
          },
        };
      }
    } else if (isSearchMode) {
      toolsConfig = [{ googleSearch: {} }];
    }

    const config: any = {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: toolsConfig,
      toolConfig: toolConfigObj,
    };

    // Use gemini-3.5-flash as explicitly required by the prompt instructions
    let response: any;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents,
        config,
      });
    } catch (primaryErr: any) {
      console.warn('Primary gemini-3.5-flash call hit error or quota limit:', primaryErr.message);

      // If quota or tool rate limit occurs, attempt with gemini-3.1-flash-lite as fallback
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            // fallback without external tools if tool quota was exceeded
          },
        });
      } catch (fallbackErr: any) {
        throw primaryErr; // Bubble up original error if fallback also fails
      }
    }

    const candidate = response.candidates?.[0];
    const text = response.text || candidate?.content?.parts?.[0]?.text || '';
    const groundingMetadata = candidate?.groundingMetadata;

    // Extract Google Search links
    const webChunks = groundingMetadata?.groundingChunks
      ?.filter((c: any) => c.web?.uri)
      .map((c: any) => ({
        title: c.web?.title || 'Web Citation',
        uri: c.web?.uri,
      })) || [];

    // Extract Google Maps links
    const mapsChunks = groundingMetadata?.groundingChunks
      ?.filter((c: any) => c.maps?.uri)
      .map((c: any) => ({
        title: c.maps?.title || 'Map Location',
        uri: c.maps?.uri,
        placeAnswerSources: c.maps?.placeAnswerSources,
      })) || [];

    const searchQueries = groundingMetadata?.webSearchQueries || [];

    return res.json({
      reply: text,
      grounding: {
        mode,
        webChunks,
        mapsChunks,
        searchQueries,
      },
    });
  } catch (error: any) {
    console.error('Error generating chat response:', error);
    return res.status(500).json({
      error: error.message || 'Failed to communicate with ZENVY Concierge service.',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', brand: 'ZENVY' });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, port: PORT, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ZENVY Server operational at http://0.0.0.0:${PORT}`);
  });
}

startServer();
