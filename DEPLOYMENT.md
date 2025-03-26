
# Deployment Guide for intentSim.org

This guide explains how to deploy the Universe Intent Simulation Explorer application to intentSim.org.

## Step 1: Build the Application

Run the following command to generate production-ready files:

```bash
npm run build
```

This will create a `dist` directory containing all the optimized static files.

## Step 2: Deploy to Your Web Server

### Option 1: Direct Upload
1. Connect to your web server using FTP, SFTP, or your hosting provider's file manager.
2. Upload all contents of the `dist` directory to the root directory of intentSim.org.
3. Ensure the `.htaccess` file is included in the upload (this handles routing for the single-page application).

### Option 2: Using Git (if your hosting supports it)
1. Push your code to your repository
2. Configure your hosting to build from your repository using the command `npm run build`
3. Configure your hosting to serve files from the `dist` directory

## Step 3: Verify the Installation
1. Visit intentSim.org in your web browser
2. Check that all pages and features work correctly
3. Test navigation between different sections of the application

## Troubleshooting

- If you encounter 404 errors when navigating between pages, ensure the `.htaccess` file is properly uploaded and that your server has `mod_rewrite` enabled.
- If your site is showing at intentSim.org/index.html instead of intentSim.org, check your server configuration to ensure the index.html file is set as the directory index.

## Additional Notes

- This application is configured to run at the root of intentSim.org
- If you need to run it in a subdirectory, modify the `base` property in `vite.config.ts` before building
