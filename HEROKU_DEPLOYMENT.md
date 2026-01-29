# Heroku Deployment Guide

This guide explains how to deploy the Addepar Integration Platform to Heroku.

## Architecture

The application is deployed as a single Heroku dyno:
- **Backend**: Express server (Node.js + TypeScript)
- **Frontend**: Built React app served by Express as static files
- **Port**: Dynamic port assigned by Heroku (via `process.env.PORT`)

## Prerequisites

- Heroku CLI installed and authenticated
- Git repository initialized
- GitHub repository (optional, but recommended)

## Deployment Steps

### 1. Create Heroku App

```bash
cd "/Users/dcovey/Addepar /addepar-integration-mock"
heroku create addepar-integration-demo
```

Or use a custom name:
```bash
heroku create your-custom-app-name
```

### 2. Deploy to Heroku

```bash
git push heroku main
```

### 3. Open Your App

```bash
heroku open
```

Or visit: `https://your-app-name.herokuapp.com`

## Configuration Files

### package.json (Root)
- Defines build and start scripts for Heroku
- `heroku-postbuild`: Runs automatically after Heroku installs dependencies
- `start`: Starts the production server

### Procfile
- Tells Heroku how to run the app
- `web: cd server && npx ts-node src/server.ts`

### server/src/server.ts
- Modified to serve static React build files
- Binds to `0.0.0.0` in production (required by Heroku)
- Uses `process.env.PORT` for dynamic port assignment

## Build Process

Heroku automatically runs these steps:

1. Install root dependencies (if any)
2. Run `heroku-postbuild` script:
   - Install client dependencies
   - Install server dependencies
   - Build React app (creates `client/dist/`)
3. Start the server with `npm start`
4. Server serves built React files from `client/dist/`

## Environment Variables

The app uses these environment variables:

- `PORT` - Set automatically by Heroku
- `NODE_ENV` - Set to `production` by Heroku

To add custom environment variables:
```bash
heroku config:set VARIABLE_NAME=value
```

## Monitoring

### View Logs
```bash
heroku logs --tail
```

### Check Dyno Status
```bash
heroku ps
```

### View App Info
```bash
heroku apps:info
```

## Troubleshooting

### Build Fails

Check logs:
```bash
heroku logs --tail
```

Common issues:
- Node version mismatch - ensure `engines` in package.json matches your local version
- Build timeout - increase build time: `heroku config:set HEROKU_NODEJS_BUILD_TIMEOUT=180`

### App Crashes

```bash
heroku restart
heroku logs --tail
```

### Check Build Output

```bash
heroku builds:info
```

## Scaling

### Check current dynos
```bash
heroku ps
```

### Scale up/down
```bash
heroku ps:scale web=1
```

## Cost

- **Free tier**: 550-1000 dyno hours per month
- App sleeps after 30 minutes of inactivity
- First request after sleep takes ~10 seconds

### Prevent Sleeping (Hobby/Professional tiers)
```bash
heroku ps:scale web=1:hobby
```

## Updates

To deploy changes:

```bash
git add .
git commit -m "Your commit message"
git push heroku main
```

## Useful Commands

```bash
# Open app in browser
heroku open

# View logs
heroku logs --tail

# Restart app
heroku restart

# Access bash shell
heroku run bash

# Check app status
heroku ps

# View config vars
heroku config

# View build info
heroku builds:info
```

## Production URLs

After deployment, your app will be available at:
- **App URL**: `https://your-app-name.herokuapp.com`
- **Health Check**: `https://your-app-name.herokuapp.com/api/health`

## Notes

- All data is in-memory and will be lost on dyno restart
- Consider adding a PostgreSQL addon for persistent storage
- Enable HTTPS automatically (Heroku provides SSL)
- First load may be slow if dyno was sleeping (free tier)

## Support

For Heroku-specific issues, consult:
- [Heroku Dev Center](https://devcenter.heroku.com/)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
