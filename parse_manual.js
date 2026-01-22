import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import { createRequire } from 'module';

// 1. Properly handle the CommonJS import in an ES Module
const require = createRequire(import.meta.url);
const pdfBase = require('pdf-parse');
// Some environments wrap the function in .default, others don't. This handles both:
const pdf = typeof pdfBase === 'function' ? pdfBase : pdfBase.default;

// 2. Setup Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// --- CONFIGURATION ---
// Update these two lines for every new file you want to add
const pdfPath = './manual1.pdf'; 
const SOURCE_NAME = 'manual1.pdf';
const CATEGORY = 'Dispatcher Training';

async function parseAndUpload() {
  try {
    // Check if the function loaded correctly
    if (typeof pdf !== 'function') {
      throw new Error("PDF parsing library failed to load correctly. Try 'npm install pdf-parse' again.");
    }

    if (!fs.existsSync(pdfPath)) {
      throw new Error(`File not found at: ${pdfPath}`);
    }

    console.log(`🚀 Starting Universal Parse for: ${pdfPath}...`);
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    
    // 3. Universal Chunking Logic
    // This looks for common transit manual patterns: "1. ", "Topic 1", or "SECTION 1"
    const sections = data.text.split(/\n(?=\d+\.|\bTopic\b|\bSECTION\b)/i); 

    console.log(`Found ${sections.length} potential sections. Cleaning data...`);

    const entries = sections.map(section => {
      const lines = section.trim().split('\n');
      const titleLine = lines[0].trim();
      
      return {
        title: titleLine.substring(0, 255), 
        content: lines.slice(1).join(' ').trim(),
        category: CATEGORY,
        source_name: SOURCE_NAME
      };
    }).filter(entry => entry.title && entry.content.length > 15);

    // 4. Deduplication Check (Prevents double-uploading)
    console.log("Checking database for existing entries...");
    const { data: existingEntries } = await supabase
      .from('manual_entries')
      .select('title')
      .eq('source_name', SOURCE_NAME);

    const existingTitles = new Set(existingEntries?.map(e => e.title) || []);
    const newEntries = entries.filter(entry => !existingTitles.has(entry.title));

    if (newEntries.length === 0) {
      console.log('✨ Database is already up to date. No new entries added.');
      return;
    }

    // 5. Final Upload
    console.log(`Uploading ${newEntries.length} new items to Supabase...`);
    const { error } = await supabase
      .from('manual_entries')
      .insert(newEntries);

    if (error) throw error;

    console.log(`✅ Success! ${newEntries.length} items are now searchable in Transit-Tutor.`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

parseAndUpload();