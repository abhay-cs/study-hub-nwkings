# Production Deployment Checklist

## ✅ Pre-Deployment (Completed)

- [x] RLS policies enabled on all tables
- [x] Redirect URLs configured in Supabase
- [x] API authentication on all routes
- [x] Input validation (5000 char limit)
- [x] Error handling (no stack traces exposed)
- [x] Email verification flow
- [x] Password reset flow
- [x] Build passes successfully

## 🚀 Deployment Steps

### 1. Environment Setup

Create `.env.local` (production):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DEEPSEEK_API_KEY=your-deepseek-key
```

### 2. Supabase Configuration

**Authentication → URL Configuration:**
- Add your production domain redirect URLs:
  - `https://yourdomain.com/auth/confirm`
  - `https://yourdomain.com/update-password`

**Authentication → Email Templates (Optional):**
- Customize "Confirm signup" template
- Customize "Reset password" template
- Add your branding/logo

**Database → RLS Policies (Already Done ✅):**
```sql
-- Verify these are enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('chat_sessions', 'chat_messages', 'users', 'courses');
```

### 3. Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Set Environment Variables in Vercel:**
- Go to Project Settings → Environment Variables
- Add all variables from `.env.local`

### 4. Post-Deployment Testing

- [ ] Test signup → email verification → login
- [ ] Test password reset flow
- [ ] Test chat functionality
- [ ] Test multiple users (no data leakage)
- [ ] Check email delivery
- [ ] Monitor error logs

## 📊 Monitoring

### Cost Monitoring
- **Supabase Dashboard**: Track DB size and requests
- **DeepSeek Dashboard**: Monitor API usage and costs
- **Vercel Dashboard**: Track bandwidth and function invocations

### Error Tracking (Recommended)
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

## 🔒 Security Checklist

- [x] RLS enabled on all tables
- [x] API routes require authentication
- [x] User data isolated (no cross-user access)
- [x] Input validation on chat
- [x] Generic error messages
- [ ] Rate limiting (optional but recommended)
- [ ] HTTPS enabled (automatic with Vercel)

## 📈 Scaling Considerations

### Current Limits (Free Tier):
- **Supabase**: 500MB database, 50k MAU
- **DeepSeek**: Pay-as-you-go (~$0.14/1M tokens)
- **Vercel**: 100GB bandwidth/month

### When to Upgrade:
- Database > 400MB → Supabase Pro ($25/mo)
- DeepSeek costs > $50/mo → Consider caching or rate limiting
- Bandwidth > 80GB/mo → Vercel Pro ($20/mo)

## 🚨 Troubleshooting

### Email verification not working:
1. Check Supabase → Authentication → Email Templates
2. Verify redirect URLs are correct
3. Check spam folder
4. Enable "Email confirmations" in Supabase settings

### Users can't access data:
1. Verify RLS policies are enabled
2. Check Supabase logs for RLS errors
3. Test with different user accounts

### Build fails:
```bash
npm run build
# Fix any TypeScript/ESLint errors
```

## 📞 Support

- Supabase: https://supabase.com/docs
- Next.js: https://nextjs.org/docs
- DeepSeek: https://platform.deepseek.com/docs

---

**Status**: ✅ Production Ready for 100 users
**Estimated Monthly Cost**: $14-20
