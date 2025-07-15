# 🚀 Deployment Guide - Spotify Enhanced

This guide will help you deploy the Spotify Enhanced music streaming application to production.

## 📋 Prerequisites

- Node.js 18+
- Git
- GitHub account
- Domain name (optional)
- Hosting service account (Vercel, Netlify, or GitHub Pages)

## 🔧 Local Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/spotify-enhanced-music-app.git
cd spotify-enhanced-music-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Test local build**
```bash
npm run build
npm run preview
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel --prod
```

4. **Custom Domain Setup**
- Go to Vercel dashboard
- Select your project
- Go to Settings > Domains
- Add your custom domain
- Configure DNS records as instructed

### Option 2: Netlify

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Login to Netlify**
```bash
netlify login
```

3. **Deploy**
```bash
netlify deploy --prod --dir=dist
```

4. **Custom Domain Setup**
- Go to Netlify dashboard
- Select your site
- Go to Domain settings
- Add custom domain
- Configure DNS records

### Option 3: GitHub Pages

1. **Enable GitHub Pages**
- Go to repository Settings
- Scroll to Pages section
- Select source: GitHub Actions

2. **The workflow will automatically deploy on push to main**

## 🔐 Environment Variables

For production deployment, you may need to set up environment variables:

```bash
# .env.production
VITE_APP_NAME="Spotify Enhanced"
VITE_APP_VERSION="1.0.0"
VITE_API_URL="https://api.yourdomain.com"
```

## 🌍 Custom Domain Setup

### DNS Configuration

For your custom domain (e.g., `spotify-enhanced.yourdomain.com`):

**For Vercel:**
```
Type: CNAME
Name: spotify-enhanced
Value: cname.vercel-dns.com
```

**For Netlify:**
```
Type: CNAME
Name: spotify-enhanced
Value: your-site-name.netlify.app
```

### SSL Certificate

Both Vercel and Netlify automatically provide SSL certificates for custom domains.

## 📊 Performance Optimization

The build is already optimized with:

- **Code splitting** - Automatic chunk splitting
- **Tree shaking** - Unused code elimination
- **Minification** - CSS and JS minification
- **Compression** - Gzip compression enabled
- **Caching** - Static asset caching headers

## 🔍 Monitoring

### Build Status

Monitor your deployments:

- **Vercel**: https://vercel.com/dashboard
- **Netlify**: https://app.netlify.com/
- **GitHub Actions**: Repository > Actions tab

### Performance Monitoring

Use these tools to monitor your deployed application:

- **Lighthouse** - Built into Chrome DevTools
- **Web Vitals** - Core web vitals monitoring
- **Vercel Analytics** - If using Vercel
- **Netlify Analytics** - If using Netlify

## 🐛 Troubleshooting

### Common Issues

1. **Build Fails**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

2. **Routing Issues (404 on refresh)**
- Ensure your hosting service is configured for SPA routing
- Check `vercel.json` or `netlify.toml` configuration

3. **Assets Not Loading**
- Check base URL configuration in `vite.config.js`
- Verify asset paths are relative

### Build Logs

Check build logs for detailed error information:

- **Vercel**: Functions tab in dashboard
- **Netlify**: Deploys tab in dashboard
- **GitHub Actions**: Actions tab in repository

## 📈 Scaling

For high-traffic scenarios:

1. **CDN Configuration**
   - Both Vercel and Netlify include global CDN
   - Assets are automatically cached worldwide

2. **Performance Monitoring**
   - Set up monitoring for Core Web Vitals
   - Monitor bundle size with each deployment

3. **Error Tracking**
   - Consider integrating Sentry or similar service
   - Monitor JavaScript errors in production

## 🔄 Continuous Deployment

The included GitHub Actions workflow automatically:

1. **Runs on every push to main**
2. **Installs dependencies**
3. **Runs linting**
4. **Builds the application**
5. **Deploys to production**

### Required Secrets

Add these secrets to your GitHub repository:

**For Vercel:**
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

**For Netlify:**
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`

## 📞 Support

If you encounter issues during deployment:

1. Check the troubleshooting section above
2. Review build logs for specific errors
3. Open an issue on GitHub with deployment details
4. Include error messages and build logs

---

**Happy Deploying! 🚀**
