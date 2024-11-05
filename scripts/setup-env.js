const fs = require('fs');
const path = require('path');

const apps = ['apps/landing', 'apps/profile', 'packages/database'];

apps.forEach(app => {
  const envPath = path.join(process.cwd(), app, '.env');
  const rootEnvPath = path.join(process.cwd(), '.env');
  
  try {
    // Remove existing symlink or file
    if (fs.existsSync(envPath)) {
      fs.unlinkSync(envPath);
    }
    
    // Create new symlink
    fs.symlinkSync(path.relative(path.dirname(envPath), rootEnvPath), envPath);
    console.log(`Created symlink for .env in ${app}`);
  } catch (error) {
    console.error(`Failed to create symlink for ${app}:`, error);
  }
}); 