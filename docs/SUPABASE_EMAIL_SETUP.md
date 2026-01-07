# Supabase Email Configuration Guide

## Overview
This guide will help you configure Supabase email templates to use your custom domain instead of `localhost:3000`.

## Step 1: Access Email Templates

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication → Email Templates**

## Step 2: Update Redirect URLs

For each email template, replace the redirect URL:

### Before (Default):
```
{{ .SiteURL }}/auth/confirm?token={{ .Token }}
```

### After (Your Domain):
```
https://your-frontend-domain.vercel.app/auth/confirm?token={{ .Token }}
```

## Templates to Update

### 1. Confirm Signup

**Subject:** Confirm Your Email - IQ Didactic

**Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">IQ Didactic</h1>
      <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Enterprise Learning Management System</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 30px;">
      <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Welcome! 🎉</h2>
      <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0;">
        Thank you for signing up for IQ Didactic. Click the button below to confirm your email address and get started with your learning journey.
      </p>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://your-frontend.vercel.app/auth/confirm?token={{ .Token }}" 
           style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
          Confirm Email Address
        </a>
      </div>
      
      <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
        If you didn't create this account, you can safely ignore this email.
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f9f9f9; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
      <p style="color: #999999; font-size: 12px; margin: 0;">
        © 2026 IQ Didactic. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
```

### 2. Magic Link

**Subject:** Sign In to IQ Didactic

**Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign In to IQ Didactic</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">IQ Didactic</h1>
    </div>
    
    <div style="padding: 40px 30px;">
      <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Sign In Request</h2>
      <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0;">
        Click the button below to sign in to your IQ Didactic account.
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://your-frontend.vercel.app/auth/confirm?token={{ .Token }}" 
           style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
          Sign In
        </a>
      </div>
      
      <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
        If you didn't request this, please ignore this email.
      </p>
    </div>
    
    <div style="background-color: #f9f9f9; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
      <p style="color: #999999; font-size: 12px; margin: 0;">
        © 2026 IQ Didactic. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
```

### 3. Reset Password

**Subject:** Reset Your Password - IQ Didactic

**Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">IQ Didactic</h1>
    </div>
    
    <div style="padding: 40px 30px;">
      <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Reset Your Password</h2>
      <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0;">
        We received a request to reset your password. Click the button below to create a new password.
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://your-frontend.vercel.app/auth/reset-password?token={{ .Token }}" 
           style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
          Reset Password
        </a>
      </div>
      
      <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
        If you didn't request a password reset, please ignore this email or contact support if you have concerns.
      </p>
    </div>
    
    <div style="background-color: #f9f9f9; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
      <p style="color: #999999; font-size: 12px; margin: 0;">
        © 2026 IQ Didactic. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
```

## Step 3: Update Site URL

1. Go to **Authentication → URL Configuration**
2. Set **Site URL** to: `https://your-frontend.vercel.app`
3. Add **Redirect URLs**:
   - `https://your-frontend.vercel.app/auth/confirm`
   - `https://your-frontend.vercel.app/auth/reset-password`
   - `http://localhost:5173/auth/confirm` (for local development)

## Step 4: Test

1. Sign up with a new email
2. Check your email inbox
3. Verify the confirmation link goes to your Vercel domain
4. Click the link and verify you're redirected to `/auth/confirm`

## Important Notes

- Replace `your-frontend.vercel.app` with your actual Vercel domain
- Update all 4 email templates (Confirm Signup, Magic Link, Reset Password, Change Email)
- Make sure redirect URLs are added to allowed list
- Test with a real email address

## Troubleshooting

If emails still redirect to localhost:
1. Double-check all templates are saved
2. Verify Site URL is correct
3. Clear browser cache
4. Try incognito mode
5. Check Supabase logs for errors
