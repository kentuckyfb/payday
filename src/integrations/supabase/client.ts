
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ufdoftqxokfianqvlttp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmZG9mdHF4b2tmaWFucXZsdHRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MzczNTEsImV4cCI6MjA2MDAxMzM1MX0.YAEfD1WfrdfGmTltyWYafDnEWDHSzVy0taVMPdNQBJc";

// Configure Supabase client with optimal settings for production
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage
  },
  global: {
    // Set reasonable timeouts for API calls
    headers: { 'x-application-name': 'payday' },
    fetch: (url, options) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      return fetch(url, {
        ...options,
        signal: controller.signal
      }).finally(() => clearTimeout(timeoutId));
    }
  },
  // Enable realtime features only where needed to save on WebSocket connections
  realtime: {
    params: {
      eventsPerSecond: 1
    }
  }
});

// Create a simple cache for common API requests
const queryCache = new Map();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

// Helper function for cached queries
export const cachedQuery = async <T>(
  key: string, 
  queryFn: () => Promise<{data: T, error: any}>
) => {
  const cached = queryCache.get(key);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result;
  }
  
  const result = await queryFn();
  
  if (!result.error) {
    queryCache.set(key, {
      timestamp: Date.now(),
      result
    });
  }
  
  return result;
};
