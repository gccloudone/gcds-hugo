#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('front-matter');

// ANSI color codes for pretty output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

const contentDir = path.join(process.cwd(), 'content');
const enDir = path.join(contentDir, 'en');
const frDir = path.join(contentDir, 'fr');

/**
 * Recursively get all markdown files in a directory
 */
function getAllMarkdownFiles(dir, baseDir = dir) {
  const files = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAllMarkdownFiles(fullPath, baseDir));
    } else if (item.endsWith('.md')) {
      files.push({
        fullPath,
        relativePath: path.relative(baseDir, fullPath),
      });
    }
  }
  
  return files;
}

/**
 * Extract translationKey and metadata from markdown file
 */
function getFileMetadata(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(content);
    return {
      translationKey: parsed.attributes.translationKey || null,
      isDraft: parsed.attributes.draft === true || parsed.attributes.draft === 'true',
    };
  } catch (error) {
    console.error(`${colors.red}Error reading file ${filePath}: ${error.message}${colors.reset}`);
    return { translationKey: null, isDraft: false };
  }
}

/**
 * Main function to check translation keys
 */
function checkTranslationKeys() {
  console.log(`${colors.bold}${colors.cyan}=== Translation Key Checker ===${colors.reset}\n`);
  
  // Get all markdown files from both directories
  const enFiles = getAllMarkdownFiles(enDir);
  const frFiles = getAllMarkdownFiles(frDir);
  
  console.log(`Found ${colors.blue}${enFiles.length}${colors.reset} files in ${colors.blue}content/en${colors.reset}`);
  console.log(`Found ${colors.blue}${frFiles.length}${colors.reset} files in ${colors.blue}content/fr${colors.reset}\n`);
  
  // Build maps of translationKey -> file info
  const enKeyMap = new Map();
  const frKeyMap = new Map();
  
  // Files without translationKey
  const enFilesWithoutKey = [];
  const frFilesWithoutKey = [];
  
  // Draft files (tracked separately)
  const enDraftFiles = [];
  const frDraftFiles = [];
  
  // Process English files
  for (const file of enFiles) {
    const metadata = getFileMetadata(file.fullPath);
    
    if (metadata.isDraft) {
      enDraftFiles.push({ ...file, translationKey: metadata.translationKey });
      continue; // Skip draft files from validation
    }
    
    if (metadata.translationKey) {
      enKeyMap.set(metadata.translationKey, file);
    } else {
      enFilesWithoutKey.push(file);
    }
  }
  
  // Process French files
  for (const file of frFiles) {
    const metadata = getFileMetadata(file.fullPath);
    
    if (metadata.isDraft) {
      frDraftFiles.push({ ...file, translationKey: metadata.translationKey });
      continue; // Skip draft files from validation
    }
    
    if (metadata.translationKey) {
      frKeyMap.set(metadata.translationKey, file);
    } else {
      frFilesWithoutKey.push(file);
    }
  }
  
  // Find missing translations
  const missingInFr = [];
  const missingInEn = [];
  
  for (const [key, file] of enKeyMap) {
    if (!frKeyMap.has(key)) {
      missingInFr.push({ key, file });
    }
  }
  
  for (const [key, file] of frKeyMap) {
    if (!enKeyMap.has(key)) {
      missingInEn.push({ key, file });
    }
  }
  
  // Report results
  let hasErrors = false;
  let hasWarnings = false;
  
  // Report draft files (warning only)
  if (enDraftFiles.length > 0 || frDraftFiles.length > 0) {
    hasWarnings = true;
    console.log(`${colors.bold}${colors.yellow}⚠ Draft files (excluded from validation):${colors.reset}`);
    
    if (enDraftFiles.length > 0) {
      console.log(`  ${colors.blue}English drafts:${colors.reset}`);
      for (const file of enDraftFiles) {
        console.log(`    ${colors.yellow}•${colors.reset} content/en/${file.relativePath}${file.translationKey ? ` (key: ${colors.magenta}${file.translationKey}${colors.reset})` : ` ${colors.yellow}(no key)${colors.reset}`}`);
      }
    }
    
    if (frDraftFiles.length > 0) {
      console.log(`  ${colors.blue}French drafts:${colors.reset}`);
      for (const file of frDraftFiles) {
        console.log(`    ${colors.yellow}•${colors.reset} content/fr/${file.relativePath}${file.translationKey ? ` (key: ${colors.magenta}${file.translationKey}${colors.reset})` : ` ${colors.yellow}(no key)${colors.reset}`}`);
      }
    }
    console.log();
  }
  
  // Files without translationKey
  if (enFilesWithoutKey.length > 0) {
    hasErrors = true;
    console.log(`${colors.bold}${colors.yellow}⚠ English files missing translationKey:${colors.reset}`);
    for (const file of enFilesWithoutKey) {
      console.log(`  ${colors.yellow}•${colors.reset} content/en/${file.relativePath}`);
    }
    console.log();
  }
  
  if (frFilesWithoutKey.length > 0) {
    hasErrors = true;
    console.log(`${colors.bold}${colors.yellow}⚠ French files missing translationKey:${colors.reset}`);
    for (const file of frFilesWithoutKey) {
      console.log(`  ${colors.yellow}•${colors.reset} content/fr/${file.relativePath}`);
    }
    console.log();
  }
  
  // Missing translations in French
  if (missingInFr.length > 0) {
    hasErrors = true;
    console.log(`${colors.bold}${colors.red}✗ Translation keys in English but missing in French:${colors.reset}`);
    for (const { key, file } of missingInFr) {
      console.log(`  ${colors.red}•${colors.reset} ${colors.magenta}${key}${colors.reset}`);
      console.log(`    EN: content/en/${file.relativePath}`);
    }
    console.log();
  }
  
  // Missing translations in English
  if (missingInEn.length > 0) {
    hasErrors = true;
    console.log(`${colors.bold}${colors.red}✗ Translation keys in French but missing in English:${colors.reset}`);
    for (const { key, file } of missingInEn) {
      console.log(`  ${colors.red}•${colors.reset} ${colors.magenta}${key}${colors.reset}`);
      console.log(`    FR: content/fr/${file.relativePath}`);
    }
    console.log();
  }
  
  // Summary
  if (!hasErrors) {
    console.log(`${colors.bold}${colors.green}✓ All translation keys match!${colors.reset}`);
    console.log(`  ${enKeyMap.size} translation key(s) found in both languages.`);
    if (hasWarnings) {
      console.log(`  ${colors.yellow}${enDraftFiles.length + frDraftFiles.length} draft file(s) excluded from validation.${colors.reset}`);
    }
    console.log();
    process.exit(0);
  } else {
    console.log(`${colors.bold}${colors.red}✗ Translation key mismatches found!${colors.reset}\n`);
    console.log(`Summary:`);
    console.log(`  • EN files without key: ${enFilesWithoutKey.length}`);
    console.log(`  • FR files without key: ${frFilesWithoutKey.length}`);
    console.log(`  • Keys missing in FR: ${missingInFr.length}`);
    console.log(`  • Keys missing in EN: ${missingInEn.length}`);
    if (hasWarnings) {
      console.log(`  • ${colors.yellow}Draft files: ${enDraftFiles.length + frDraftFiles.length} (warning)${colors.reset}`);
    }
    console.log();
    process.exit(1);
  }
}

// Run the checker
checkTranslationKeys();
