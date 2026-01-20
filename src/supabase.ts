import { createClient } from "@supabase/supabase-js";

type Record = {
  id: number;
  title: string;
  time: number;
};

// Create a single supabase client for interacting with your database
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;

export const fetchRecords = async () => {
    const { data, error } = (await supabase.from("records").select()) as {
      data: Record[];
      error: Error | null;
    };
    if (error) {
      throw error;
    }
  
    return data;
  };
  
  export const addRecord = async (learningContent: string, learningTime: number) => {
    const { data, error } = await supabase.from("records").insert({ title: learningContent, time: learningTime }).select();
    if (error) {
      throw error;
    }
    return data;
  };