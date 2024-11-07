const fs = require('fs');
const path = require('path');

const apps = ['landing', 'dashboard', 'web', 'docs'];
const packages = ['database'];

// Create symlinks for apps
apps.forEach(app => {
  const envPath = path.join(__dirname, '..', 'apps', app, '.env');
  const rootEnvPath = path.join(__dirname, '..', '.env');
  
  try {
    if (!fs.existsSync(envPath)) {
      fs.symlinkSync('../../.env', envPath);
      console.log(`Created symlink for .env in apps/${app}`);
    }
  } catch (error) {
    console.error(`Failed to create symlink for apps/${app}:`, error);
  }
});

// Create symlinks for packages
packages.forEach(pkg => {
  const envPath = path.join(__dirname, '..', 'packages', pkg, '.env');
  const rootEnvPath = path.join(__dirname, '..', '.env');
  
  try {
    if (!fs.existsSync(envPath)) {
      fs.symlinkSync('../../.env', envPath);
      console.log(`Created symlink for .env in packages/${pkg}`);
    }
  } catch (error) {
    console.error(`Failed to create symlink for packages/${pkg}:`, error);
  }
}); 