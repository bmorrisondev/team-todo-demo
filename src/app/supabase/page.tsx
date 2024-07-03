"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    const res = await client.from("addresses").select();
    console.log(res)
    const { error, data } = res;
    if (!error) setAddresses(data);
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const sendAddress = async () => {
    if (!inputRef.current?.value) return;
    const res = await client.from("addresses").insert({
      // Replace content with whatever field you want
      line1: inputRef.current?.value,
    });
    console.log(res)
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Input
          onSubmit={sendAddress}
          style={{ color: "black" }}
          type="text"
          ref={inputRef}
        />
        <Button onClick={sendAddress}>Send Address</Button>
        <Button onClick={listAddresses}>Fetch Addresses</Button>
      </div>
      <h2>Addresses</h2>
      {!addresses ? (
        <p>No addresses</p>
      ) : (
        <ul>
          {addresses.map((address: any) => (
            <li key={address.id}>{JSON.stringify(address)}</li>
          ))}
        </ul>
      )}
    </>
  );
}