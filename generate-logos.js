// Script to generate logo files for PWA manifest
// Run: node generate-logos.js

console.log('\n📋 Logo Generation Instructions\n');
console.log('To complete the PWA setup, you need to create two logo files:');
console.log('1. logo-192.png (192x192 pixels)');
console.log('2. logo-512.png (512x512 pixels)\n');

console.log('Option 1: Use an online tool');
console.log('- Visit: https://www.iloveimg.com/resize-image');
console.log('- Upload: src/assets/images/logo.png');
console.log('- Resize to 192x192 and save as logo-192.png in public/');
console.log('- Resize to 512x512 and save as logo-512.png in public/\n');

console.log('Option 2: Use command line (if you have ImageMagick installed)');
console.log('Run these commands from your project root:\n');
console.log('  magick src/assets/images/logo.png -resize 192x192 public/logo-192.png');
console.log('  magick src/assets/images/logo.png -resize 512x512 public/logo-512.png\n');

console.log('Option 3: Manual resize');
console.log('- Open src/assets/images/logo.png in any image editor');
console.log('- Resize to 192x192, save as public/logo-192.png');
console.log('- Resize to 512x512, save as public/logo-512.png\n');

console.log('✅ After creating the logos, your PWA will be ready!\n');
