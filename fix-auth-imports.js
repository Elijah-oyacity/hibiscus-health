#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Files that need to be fixed (API routes)
const filesToFix = [
  'app/api/checkout/subscription/route.ts',
  'app/api/subscription/route.ts',
  'app/api/account/route.ts',
  'app/api/orders/route.ts',
  'app/api/user/route.ts',
  'app/api/admin/orders/route.ts',
  'app/api/admin/customers/route.ts',
  'app/api/user/subscriptions/route.ts',
  'app/api/user/subscriptions/cancel/route.ts',
  'app/api/admin/analytics/route.ts',
  'app/api/admin/products/route.ts'
];

console.log('Fixing getServerSession imports in API routes...');

filesToFix.forEach(relativePath => {
  const filePath = path.join(__dirname, relativePath);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file already has authOptions import
    if (!content.includes('import authOptions from "@/lib/auth.config"')) {
      // Add import after other NextAuth imports
      if (content.includes('import { getServerSession } from "next-auth"')) {
        content = content.replace(
          'import { getServerSession } from "next-auth"',
          'import { getServerSession } from "next-auth"\nimport authOptions from "@/lib/auth.config"'
        );
      }
    }
    
    // Replace getServerSession() calls with getServerSession(authOptions)
    content = content.replace(/getServerSession\(\)/g, 'getServerSession(authOptions)');
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed: ${relativePath}`);
  } else {
    console.log(`⚠️  File not found: ${relativePath}`);
  }
});

console.log('✅ All API routes have been fixed!');
