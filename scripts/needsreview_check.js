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
 * Recursively get all markdown files in a directory, excluding splash
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
 * Extract metadata and check for needs-review shortcode
 */
function getFileMetadata(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(content);
    
    // Check for needs-review shortcode in the content
    // Matches patterns like {{< needs-review >}} or {{< needs_review >}}
    const needsReviewPattern = /\{\{[<%]\s*needs[-_]review\s*[%>]\}\}/i;
    const hasNeedsReview = needsReviewPattern.test(parsed.body);
    
    return {
      isDraft: parsed.attributes.draft === true || parsed.attributes.draft === 'true',
      hasNeedsReview: hasNeedsReview,
    };
  } catch (error) {
    console.error(`${colors.red}Error reading file ${filePath}: ${error.message}${colors.reset}`);
    return { isDraft: false, hasNeedsReview: false };
  }
}

/**
 * Main function to check for needs-review shortcodes
 */
function checkNeedsReview() {
  console.log(`${colors.bold}${colors.cyan}=== Needs Review Checker ===${colors.reset}\n`);
  
  // Get all markdown files from both directories
  const enFiles = getAllMarkdownFiles(enDir);
  const frFiles = getAllMarkdownFiles(frDir);
  
  console.log(`Found ${colors.blue}${enFiles.length}${colors.reset} files in ${colors.blue}content/en${colors.reset}`);
  console.log(`Found ${colors.blue}${frFiles.length}${colors.reset} files in ${colors.blue}content/fr${colors.reset}\n`);
  
  // Files with needs-review shortcode
  const enFilesNeedingReview = [];
  const frFilesNeedingReview = [];

  // Draft files (tracked separately)
  const enDraftFiles = [];
  const frDraftFiles = [];
  
  // Process English files
  for (const file of enFiles) {
    const metadata = getFileMetadata(file.fullPath);
    
    if (metadata.hasNeedsReview) {
      if (metadata.isDraft) {
        enDraftFiles.push(file);
      } else {
        enFilesNeedingReview.push(file);
      }
    }
  }

  // Process French files
  for (const file of frFiles) {
    const metadata = getFileMetadata(file.fullPath);
    
    if (metadata.hasNeedsReview) {
      if (metadata.isDraft) {
        frDraftFiles.push(file);
      } else {
        frFilesNeedingReview.push(file);
      }
    }
  }
  
  // Report results
  let hasErrors = false;
  let hasWarnings = false;
  
  // Report draft files with needs-review (warning only)
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
  
  // English files with needs-review shortcode (error)
  if (enFilesNeedingReview.length > 0) {
    hasErrors = true;
    console.log(`${colors.bold}${colors.red}✗ English files containing needs-review shortcode:${colors.reset}`);
    for (const file of enFilesNeedingReview) {
      console.log(`  ${colors.red}•${colors.reset} content/en/${file.relativePath}`);
    }
    console.log();
  }

  // French files with needs-review shortcode (error)
  if (frFilesNeedingReview.length > 0) {
    hasErrors = true;
    console.log(`${colors.bold}${colors.red}✗ French files containing needs-review shortcode:${colors.reset}`);
    for (const file of frFilesNeedingReview) {
      console.log(`  ${colors.red}•${colors.reset} content/fr/${file.relativePath}`);
    }
    console.log();
  }
  
  // Summary
  if (!hasErrors) {
    console.log(`${colors.bold}${colors.green}✓ No files with needs-review shortcode found!${colors.reset}`);
    if (hasWarnings) {
      console.log(`  ${colors.yellow}${enDraftFiles.length + frDraftFiles.length} draft file(s) with needs-review shortcode excluded from validation.${colors.reset}`);
    }
    console.log();
    process.exit(0);
  } else {
    console.log(`${colors.bold}${colors.red}✗ Files with needs-review shortcode found!${colors.reset}\n`);
    console.log(`Summary:`);
    console.log(`  • EN files with needs-review shortcode: ${enFilesNeedingReview.length}`);
    console.log(`  • FR files with needs-review shortcode: ${frFilesNeedingReview.length}`);
    if (hasWarnings) {
      console.log(`  • ${colors.yellow}Draft files: ${enDraftFiles.length + frDraftFiles.length} (warning)${colors.reset}`);
    }
    console.log();
    process.exit(1);
  }
}

// Run the checker
checkNeedsReview();
