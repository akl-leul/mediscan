# Database Update Instructions

## Adding User Registration Fields

This guide will help you add the new user registration fields (phone number, country, and gender) to your Supabase database.

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase project dashboard at https://supabase.com
2. Click on the "SQL Editor" tab in the left sidebar

### Step 2: Run the SQL Script

1. Open the file `database/add_user_fields.sql` in this project
2. Copy the entire contents of the file
3. Paste it into the Supabase SQL Editor
4. Click "Run" to execute the script

### What the Script Does

The SQL script will:

1. **Add new columns** to your users table (if it exists):
   - `phone_number` (VARCHAR(20))
   - `country` (VARCHAR(100))
   - `gender` (VARCHAR(20))

2. **Create the users table** (if it doesn't exist) with all necessary fields

3. **Set up Row Level Security (RLS)** policies:
   - Users can view their own profile
   - Users can insert their own profile
   - Users can update their own profile

4. **Create triggers**:
   - Automatically update `updated_at` timestamp when a user profile is updated
   - Automatically create a user profile when a new auth user is created

### Step 3: Verify the Changes

After running the script, you can verify the changes by:

1. Going to the "Table Editor" in Supabase
2. Selecting the `users` table
3. Checking that the new columns appear in the table structure

### Testing

After setting up the database, you can test the registration flow:

1. Start your Expo app: `npx expo start`
2. Navigate to the registration screen
3. Fill in all the fields including phone number, country, and gender
4. Submit the form
5. Check your Supabase users table to confirm the data is saved

### Troubleshooting

If you encounter any errors:

- **"relation 'users' already exists"**: This is normal if you're running the script for the second time. The script uses `IF NOT EXISTS` clauses to prevent errors.
  
- **Permission denied**: Make sure you're logged in to Supabase and have the necessary permissions to modify the database schema.

- **RLS policy errors**: If you see errors related to RLS policies, you may need to drop existing policies before creating new ones.

### Optional Customizations

You can customize the SQL script based on your needs:

- **Change column sizes**: Modify the VARCHAR sizes if you need longer values
- **Add validation**: Add more CHECK constraints for data validation
- **Add indexes**: Add additional indexes for better query performance
- **Modify policies**: Adjust the RLS policies based on your security requirements

## Code Changes Summary

### Frontend Changes

1. **app/auth/register.tsx**:
   - Added phone number, country, and gender input fields
   - Added validation for the new fields
   - Updated the signUp call to pass the additional metadata

2. **contexts/AuthContext.tsx**:
   - Updated `signUp` function signature to accept metadata
   - Added code to store metadata in user profile table
   - Included metadata in auth.users meta_data

3. **components/TextInput.tsx**:
   - Added `keyboardType` prop support for better mobile UX

### NPM Package Added

- `@react-native-picker/picker`: For the gender selection dropdown

## Next Steps

After setting up the database, you can:

1. Add more user profile fields as needed
2. Create a user profile screen to display and edit this information
3. Add validation rules for phone numbers based on country codes
4. Implement a country dropdown with a list of countries
5. Add profile image upload functionality
