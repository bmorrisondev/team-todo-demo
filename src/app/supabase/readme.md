# Supabase Clerk RLS Integration

## What it is

A method to work with data in a Supabase database using Clerk tokens that uses the `sub` field from the token (the sub field is the user ID in Clerk) as the user id.

When you create the RLS policies, they appear to execute before the data is returned.

Given the following table:

```sql
create table addresses(
  id serial primary key,
  user_id text not null default (requesting_user_id()),
  line1 text,
  line2 text,
  city text,
  state text,
  zip integer
)
```

And a Clerk token that has the following claims:

```json
{
  "app_metadata": {},
  "aud": "authenticated",
  "azp": "http://localhost:3000",
  "email": "brian@brianmorrison.me",
  "exp": 1720019590,
  "iat": 1720019530,
  "iss": "https://assuring-cod-50.clerk.accounts.dev",
  "jti": "e7084fa2b7c6cf8ea539",
  "nbf": 1720019525,
  "role": "authenticated",
  "sub": "user_2iNu3heTeGj0U8G2gGFPWnVLbZm",
  "user_metadata": {}
}
```

When the correct policies are in place, executing `%SUPABASE_URL%/rest/v1/addresses?select=*` effectively runs:

```sql
select * from addresses where user_id = 'user_2iNu3heTeGj0U8G2gGFPWnVLbZm'
```


## What it is not

- From what I can tell, there is no automatic syncing of user data between Clerk & SB.

## Steps to make it work

### Create the helper functions

In the SQL Editor, execute the following query to create the necessary helper `requesting_user_id()` function that will return the `sub` from the token embedded in the HTTP request to SB:

```sql
CREATE OR REPLACE FUNCTION requesting_user_id()
RETURNS TEXT AS $$
    SELECT NULLIF(
        current_setting('request.jwt.claims', true)::json->>'sub',
        ''
    )::text;
$$ LANGUAGE SQL STABLE;
```

### Update the table

For any table you want to access data with, add a `user_id` column that defaults to using the function in the previous step to set its default value. Replace `%TABLE_NAME%` with the table name of your choice.

```sql
alter table %TABLE_NAME% add user_id text not null default (requesting_user_id());
```

### Enable RLS on the table

This can be done in Database > Tables > Click three dots next to table name > Edit > "Enable Row Level Security (RLS)".

### Create the policies

Use the SQL editor again to create the necessary policies. This demo just creates policies for `SELECT` and `INSERT` statements, but check here for documentation on other query types.

https://supabase.com/docs/guides/database/postgres/row-level-security#creating-policies

Replace `%TABLE_NAME%` as needed:

```sql
-- Creates a polciy for SELECT statements
CREATE POLICY "select user %TABLE_NAME%" ON "public"."%TABLE_NAME%"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (requesting_user_id() = user_id)

-- Creates a policy for INSERT statements
CREATE POLICY "select user %TABLE_NAME%" ON "public"."%TABLE_NAME%"
AS PERMISSIVE FOR SELECT
TO authenticated
WITH CHECK (requesting_user_id() = user_id)
```

### Get the remaining Supabase info

To find the JWT secret key:

- In the Supabase dashboard, select your project.
- In the sidebar, select Settings > API. Copy the value in the JWT Secret field. (Will be used in the Clerk Dashboard)

Find your Supabase credentials:
- Go to your Supabase dashboard. In the sidebar, select Settings > API.
- Copy the Project URL (will go into .env.local as `NEXT_PUBLIC_SUPABASE_URL`)
- Copy the value beside anon public in the Project API Keys section. (will go into .env.local as `NEXT_PUBLIC_SUPABASE_KEY`)

### Create the JWT template in Clerk:

Perform the following in the Clerk Dashboard

- Open your project in the Clerk Dashboard and navigate to the JWT Templates page in the sidebar.
- Select the New template button, then select Supabase from the list of options.
- Configure your template:
  - The value of the Name field will be required when using the template in your code. For this tutorial, name it supabase.
  - Signing algorithm will be HS256 by default. This algorithm is required to use JWTs with Supabase. Learn more in their docs.
  - Under Signing key, add the value of your Supabase JWT secret key from the previous step.
  - Leave all other fields at their default settings unless you want to customize them. See Clerk's JWT template docs to learn what each of them do.
  - Select Apply changes to complete setup.

### Update your project

Update your .env.local file with the following values:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
```

Create a page to use Supabase in your Next.js project. This is using the app router, so the file is at `src/app/supabase/page.tsx`:

```tsx
"use client";
import { createClient } from "@supabase/supabase-js";
import { useRef, useState } from "react";

// Add clerk to Window to avoid type errors
declare global {
  interface Window {
    Clerk: any;
  }
}

function createClerkSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      global: {
        // Get the Supabase token with a custom fetch method
        fetch: async (url, options = {}) => {
          const clerkToken = await window.Clerk.session?.getToken({
            template: "supabase",
          });

          // Construct fetch headers
          const headers = new Headers(options?.headers);
          headers.set("Authorization", `Bearer ${clerkToken}`);

          // Now call the default fetch
          return fetch(url, {
            ...options,
            headers,
          });
        },
      },
    }
  );
}

const client = createClerkSupabaseClient();

export default function Supabase() {
  const [addresses, setAddresses] = useState<any>();
  const listAddresses = async () => {
    // Fetches all addresses scoped to the user
    // Replace "Addresses" with your table name
    const { data, error } = await client.from("Addresses").select();
    if (!error) setAddresses(data);
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const sendAddress = async () => {
    if (!inputRef.current?.value) return;
    await client.from("Addresses").insert({
      // Replace content with whatever field you want
      line1: inputRef.current?.value,
    });
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <input
          onSubmit={sendAddress}
          style={{ color: "black" }}
          type="text"
          ref={inputRef}
        />
        <button onClick={sendAddress}>Send Address</button>
        <button onClick={listAddresses}>Fetch Addresses</button>
      </div>
      <h2>Addresses</h2>
      {!addresses ? (
        <p>No addresses</p>
      ) : (
        <ul>
          {addresses.map((address: any) => (
            <li key={address.id}>{address.line1}</li>
          ))}
        </ul>
      )}
    </>
  );
}
```