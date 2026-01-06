import { createClient, processLock } from '@supabase/supabase-js'
import { Platform } from 'react-native'
import Constant from 'expo-constants'

let storage: any = undefined
let detectSessionInUrl = true

if (Platform.OS !== 'web') {
  storage = require('@react-native-async-storage/async-storage').default
  detectSessionInUrl = false
}

export const supabase = createClient(
  Constant.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL!,
  Constant.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_KEY!,
  {
    auth: {
      ...(storage ? { storage } : {}),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl,
      ...(storage ? { lock: processLock } : {}),
    },
  }
)