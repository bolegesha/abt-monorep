const fs = require('fs');
const path = require('path');

const apps = ['landing', 'dashboard', 'web', 'docs'];
const packages = ['database'];

// Create or update symlinks for apps
apps.forEach(app => {
  const envPath = path.join(__dirname, '..', 'apps', app, '.env');
  const rootEnvPath = path.join(__dirname, '..', '.env');
  
  try {
    // Remove existing symlink or file if it exists
    if (fs.existsSync(envPath)) {
      fs.unlinkSync(envPath);
    }
    
    // Create new symlink
    fs.symlinkSync('../../.env', envPath);
    console.log(`Created symlink for .env in apps/${app}`);
  } catch (error) {
    // If symlink creation fails, try to copy the file instead
    try {
      fs.copyFileSync(rootEnvPath, envPath);
      console.log(`Copied .env file to apps/${app}`);
    } catch (copyError) {
      console.error(`Failed to create symlink or copy .env for apps/${app}:`, error);
    }
  }
});

// Create or update symlinks for packages
packages.forEach(pkg => {
  const envPath = path.join(__dirname, '..', 'packages', pkg, '.env');
  const rootEnvPath = path.join(__dirname, '..', '.env');
  
  try {
    // Remove existing symlink or file if it exists
    if (fs.existsSync(envPath)) {
      fs.unlinkSync(envPath);
    }
    
    // Create new symlink
    fs.symlinkSync('../../.env', envPath);
    console.log(`Created symlink for .env in packages/${pkg}`);
  } catch (error) {
    // If symlink creation fails, try to copy the file instead
    try {
      fs.copyFileSync(rootEnvPath, envPath);
      console.log(`Copied .env file to packages/${pkg}`);
    } catch (copyError) {
      console.error(`Failed to create symlink or copy .env for packages/${pkg}:`, error);
    }
  }
}); 