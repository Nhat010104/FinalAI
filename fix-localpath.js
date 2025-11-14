// Script to fix duplicate paths in localPath field
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import VatFile from './src/models/VatFile.js';

dotenv.config();

async function fixLocalPaths() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vat-backend');
    console.log('✅ Connected to database');

    // Find all VatFile records
    const vatFiles = await VatFile.find({ localPath: { $exists: true, $ne: null } });
    console.log(`📋 Found ${vatFiles.length} records with localPath`);

    let fixed = 0;
    for (const vatFile of vatFiles) {
      let localPath = vatFile.localPath;
      const originalPath = localPath;

      // Remove all occurrences of "uploads/vat_files/"
      while (localPath.includes('uploads/vat_files/')) {
        localPath = localPath.replace('uploads/vat_files/', '');
      }

      // Remove any leading slashes
      localPath = localPath.replace(/^[/\\]+/, '');

      // Get just the filename
      const filename = localPath.split(/[/\\]/).pop();

      // Only update if path changed
      if (filename && filename !== originalPath) {
        vatFile.localPath = filename;
        await vatFile.save();
        console.log(`✅ Fixed: ${originalPath} → ${filename}`);
        fixed++;
      }
    }

    console.log(`\n✅ Fixed ${fixed} records`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixLocalPaths();


