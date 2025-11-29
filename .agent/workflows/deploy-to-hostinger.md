---
description: Step-by-step guide to deploy the full-stack Next.js application to Hostinger
---

# Deploying Full-Stack Next.js Application to Hostinger

This guide will walk you through deploying your full-stack application (Next.js frontend + Node.js backend with Prisma) to Hostinger.

> [!IMPORTANT] > **Important Notes About Hostinger Basic Plans:**
>
> - Basic shared hosting plans typically don't support Node.js applications
> - You'll need either **Hostinger VPS** or **Cloud Hosting** plan for Node.js support
> - If you only have basic shared hosting, consider deploying frontend and backend separately (e.g., Vercel for frontend, Railway/Render for backend)

## Prerequisites Checklist

Before starting deployment, ensure you have:

- [ ] Hostinger VPS or Cloud Hosting plan (Node.js support required)
- [ ] SSH access to your Hostinger server
- [ ] Domain name configured (optional but recommended)
- [ ] PostgreSQL database (can be on Hostinger or external like Neon, Supabase)
- [ ] All environment variables documented
- [ ] AWS S3 credentials (if using file uploads)

---

## Part 1: Pre-Deployment Preparation

### Step 1: Update Package Scripts

Update your backend `package.json` to include production scripts:

**File:** `d:\Abhishek\tcpwebsite\backend\package.json`

Add/modify these scripts:

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "prisma:generate": "node prisma_generate.js",
    "prisma:migrate:deploy": "npx prisma migrate deploy",
    "prisma:studio": "npx dotenv -e .env -- prisma studio",
    "build": "npm run prisma:generate"
  }
}
```

### Step 2: Create Production Environment Files

Create `.env.production` files for both frontend and backend with production values:

**Backend `.env.production` template:**

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
PORT=3001
NODE_ENV=production
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=your_region
S3_BUCKET_NAME=your_bucket
FRONTEND_URL=https://yourdomain.com
```

**Frontend `.env.production` template:**

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Step 3: Build and Test Locally

Test your production build locally before deployment:

```bash
# Build frontend
npm run build

# Test backend in production mode
cd backend
NODE_ENV=production node src/server.js
```

---

## Part 2: Database Setup

### Option A: Using Hostinger MySQL/PostgreSQL

1. **Log in to Hostinger hPanel**
2. Navigate to **Databases** → **PostgreSQL Databases** (or MySQL)
3. Create a new database:
   - Database name: `tcpwebsite_db`
   - Username: `tcpwebsite_user`
   - Password: Generate a strong password
   - Note down all credentials

### Option B: Using External PostgreSQL (Recommended)

Use a managed PostgreSQL service for better performance:

**Neon (Free tier available):**

1. Sign up at https://neon.tech
2. Create a new project
3. Copy the connection string
4. Use it as your `DATABASE_URL`

**Supabase (Free tier available):**

1. Sign up at https://supabase.com
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (connection pooling recommended)

---

## Part 3: Server Setup (VPS/Cloud Hosting)

### Step 1: Connect to Your Server via SSH

```bash
ssh root@your_server_ip
```

Or use Hostinger's built-in terminal in hPanel.

### Step 2: Install Node.js (if not installed)

```bash
# Install Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 3: Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

### Step 4: Install Nginx (Web Server)

```bash
sudo apt update
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## Part 4: Deploy Backend Application

### Step 1: Upload Backend Code

Option A - Using Git (Recommended):

```bash
# On server
cd /var/www
git clone https://github.com/yourusername/your-repo.git tcpwebsite
cd tcpwebsite/backend
```

Option B - Using SFTP:

- Use FileZilla or WinSCP
- Upload `backend` folder to `/var/www/tcpwebsite/backend`

### Step 2: Set Up Backend Environment

```bash
cd /var/www/tcpwebsite/backend

# Create .env file
nano .env
```

Paste your production environment variables, then save (Ctrl+X, Y, Enter).

### Step 3: Install Dependencies and Build

```bash
# Install dependencies
npm install --production

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate:deploy
```

### Step 4: Start Backend with PM2

```bash
# Start the application
pm2 start src/server.js --name "tcp-backend"

# Save PM2 configuration
pm2 save

# Enable PM2 to start on boot
pm2 startup
```

Verify backend is running:

```bash
pm2 status
pm2 logs tcp-backend
```

---

## Part 5: Deploy Frontend Application

### Step 1: Build Frontend Locally

On your local machine:

```bash
# Navigate to project root
cd d:\Abhishek\tcpwebsite

# Build Next.js for production
npm run build
```

This creates a `.next` folder with production-optimized files.

### Step 2: Upload Frontend to Server

Upload these folders/files to server at `/var/www/tcpwebsite`:

- `.next/`
- `public/`
- `src/`
- `package.json`
- `next.config.ts`
- `.env.production` (as `.env.local`)

Using SFTP or:

```bash
# On local machine (if using rsync)
rsync -avz --exclude 'node_modules' ./ root@your_server_ip:/var/www/tcpwebsite/
```

### Step 3: Install Dependencies on Server

```bash
# On server
cd /var/www/tcpwebsite

# Install production dependencies
npm install --production
```

### Step 4: Start Frontend with PM2

```bash
# Start Next.js in production mode
pm2 start npm --name "tcp-frontend" -- start

# Save configuration
pm2 save
```

---

## Part 6: Configure Nginx Reverse Proxy

### Step 1: Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/tcpwebsite
```

Paste this configuration:

```nginx
# Backend API configuration
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend configuration
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Replace `yourdomain.com` with your actual domain.

### Step 2: Enable the Configuration

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/tcpwebsite /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## Part 7: Set Up SSL Certificate (HTTPS)

### Install Certbot and Get Free SSL

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Follow the prompts
# Choose option 2 to redirect HTTP to HTTPS
```

Certbot will automatically:

- Obtain SSL certificates
- Configure Nginx for HTTPS
- Set up auto-renewal

Verify auto-renewal:

```bash
sudo certbot renew --dry-run
```

---

## Part 8: Configure Domain DNS

In your domain registrar (or Hostinger DNS settings):

1. **Add A Records:**

   - Type: `A`, Name: `@`, Value: `your_server_ip`
   - Type: `A`, Name: `www`, Value: `your_server_ip`
   - Type: `A`, Name: `api`, Value: `your_server_ip`

2. **Wait for DNS propagation** (can take up to 48 hours, usually 15-30 minutes)

---

## Part 9: Post-Deployment Verification

### Check All Services

```bash
# Check PM2 processes
pm2 status

# View logs
pm2 logs tcp-frontend --lines 50
pm2 logs tcp-backend --lines 50

# Check Nginx status
sudo systemctl status nginx

# Check if ports are listening
sudo netstat -tulpn | grep LISTEN
```

### Test Endpoints

```bash
# Test backend API
curl http://localhost:3001/api/health

# Test frontend
curl http://localhost:3000

# Test public URLs
curl https://yourdomain.com
curl https://api.yourdomain.com/api/health
```

### Monitor Application

```bash
# Real-time monitoring
pm2 monit

# Check resource usage
pm2 status
```

---

## Part 10: Ongoing Maintenance

### Update Application

When you need to deploy updates:

```bash
# For backend
cd /var/www/tcpwebsite/backend
git pull  # or upload new files
npm install
npm run prisma:migrate:deploy  # if schema changed
pm2 restart tcp-backend

# For frontend
cd /var/www/tcpwebsite
git pull  # or upload new files
npm install
npm run build
pm2 restart tcp-frontend
```

### Backup Database

```bash
# Create backup script
nano /home/backup-db.sh
```

Add:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > /home/backups/db_backup_$DATE.sql
```

Make executable and schedule:

```bash
chmod +x /home/backup-db.sh
crontab -e
# Add: 0 2 * * * /home/backup-db.sh  # Daily at 2 AM
```

### Monitor Logs

```bash
# View logs in real-time
pm2 logs

# Save logs to file
pm2 logs --out /var/log/pm2-out.log --err /var/log/pm2-err.log
```

---

## Troubleshooting

### Backend Not Starting

```bash
# Check logs
pm2 logs tcp-backend

# Common issues:
# 1. Database connection - verify DATABASE_URL
# 2. Port already in use - change PORT in .env
# 3. Missing dependencies - run npm install
```

### Frontend Build Errors

```bash
# Clear cache and rebuild
rm -rf .next
npm run build

# Check environment variables
cat .env.local
```

### Database Connection Issues

```bash
# Test database connection
cd /var/www/tcpwebsite/backend
npx prisma db pull  # Should connect without errors
```

### SSL Certificate Issues

```bash
# Renew certificate manually
sudo certbot renew

# Check certificate expiry
sudo certbot certificates
```

---

## Alternative Deployment Options

If Hostinger doesn't support Node.js or you encounter issues:

### Split Deployment Approach

1. **Frontend:** Deploy to [Vercel](https://vercel.com) (free tier, optimized for Next.js)

   ```bash
   npm install -g vercel
   vercel
   ```

2. **Backend:** Deploy to [Railway](https://railway.app) or [Render](https://render.com) (free tier available)

   - Connect your GitHub repository
   - Set environment variables
   - Deploy automatically

3. **Database:** Use [Neon](https://neon.tech) or [Supabase](https://supabase.com) (free PostgreSQL)

This approach is often easier and more reliable than shared hosting.

---

## Summary Checklist

- [ ] Server has Node.js installed
- [ ] PostgreSQL database created and accessible
- [ ] Backend code uploaded and dependencies installed
- [ ] Backend environment variables configured
- [ ] Prisma migrations applied successfully
- [ ] Backend running with PM2
- [ ] Frontend built and uploaded
- [ ] Frontend running with PM2
- [ ] Nginx configured as reverse proxy
- [ ] Domain DNS records configured
- [ ] SSL certificate installed (HTTPS)
- [ ] All endpoints accessible via domain
- [ ] PM2 configured to start on boot
- [ ] Backup strategy in place

---

## Need Help?

- **Hostinger Support:** 24/7 chat support in hPanel
- **PM2 Documentation:** https://pm2.keymetrics.io/docs/usage/quick-start/
- **Nginx Documentation:** https://nginx.org/en/docs/
- **Prisma Documentation:** https://www.prisma.io/docs
