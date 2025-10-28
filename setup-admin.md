# Admin Account Setup

## Login Credentials

**Admin Email:** `admin@bosombuddy.com`
**Admin Password:** `BosomBuddy2024!`

Use these credentials to log in to the POS system at `/pos.html`

---

## Setting Up Admin Account (First Time Only)

If the admin account doesn't exist yet, create it in Supabase:

### Step 1: Create Admin User in Supabase Dashboard

1. Go to your [Supabase Authentication page](https://supabase.com/dashboard/project/yeqfmfgzqzvadhuoqxsl/auth/users)
2. Click "Add user" → "Create new user"
3. Enter:
   - Email: `admin@bosombuddy.com`
   - Password: `BosomBuddy2024!`
   - Auto Confirm User: ✓ (checked)
   - User Metadata: Add this JSON:
     ```json
     {
       "username": "Admin"
     }
     ```
4. Click "Create user"
5. **Copy the User ID** (UUID) that gets generated

## Step 2: Assign Admin Role

Run this SQL in your [SQL Editor](https://supabase.com/dashboard/project/yeqfmfgzqzvadhuoqxsl/sql/new):

```sql
-- Replace 'USER_ID_HERE' with the actual UUID from Step 1
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID_HERE', 'admin');
```

## Step 3: Email Confirmation

If you have "Confirm email" enabled in Supabase:
- Go to [Auth Providers settings](https://supabase.com/dashboard/project/yeqfmfgzqzvadhuoqxsl/auth/providers)
- Scroll to "Email" section
- Consider disabling "Confirm email" for faster testing
- Or click the confirmation link sent to the admin email

## Creating Workers

Once logged in as admin:

1. Go to the POS system (`/pos.html`)
2. Navigate to the "Workers" tab
3. Fill in the worker details:
   - Username (e.g., "John Smith")
   - Email (e.g., "john@example.com")
   - Password (set a secure password)
4. Click "Add Worker"

The system will automatically:
- Create the authentication account
- Create the user profile
- Assign the "worker" role
- Enable the worker to log in and use the POS system

**Important:** Make sure the edge function `create-worker` is deployed for this to work properly.
