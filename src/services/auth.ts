import {supabase} from './supabase';
export async function register(email:string,password:string){if(!supabase)throw Error('Supabase nėra sukonfigūruotas.');return supabase.auth.signUp({email,password});}
export async function login(email:string,password:string){if(!supabase)throw Error('Supabase nėra sukonfigūruotas.');return supabase.auth.signInWithPassword({email,password});}
export async function logout(){if(!supabase)throw Error('Supabase nėra sukonfigūruotas.');return supabase.auth.signOut();}
