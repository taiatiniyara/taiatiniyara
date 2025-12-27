import { config } from 'dotenv';
import { generateSitemap } from './sitemap-generator';

// Load environment variables from .env.local file (or .env as fallback)
config({ path: '.env.local' });
config(); // Also try .env as fallback

// Generate and output sitemap
generateSitemap().then((xml) => {
  console.log(xml);
}).catch((error) => {
  console.error('Error generating sitemap:', error);
  process.exit(1);
});
