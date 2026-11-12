import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import type {Session} from '@supabase/supabase-js';
import {supabase} from '../services/supabase';

const AuthContext=createContext<{session:Session|null;loading:boolean}>({session:null,loading:true});

export function AuthProvider({children}:{children:ReactNode}){
  const [session,setSession]=useState<Session|null>(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    if(!supabase){setLoading(false);return}
    let active=true;
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,nextSession)=>{
      setSession(nextSession);
      setLoading(false);
    });

    async function loadCurrentUser(){
      const {data:{session:storedSession}}=await supabase.auth.getSession();
      if(!active)return;
      if(!storedSession){setSession(null);setLoading(false);return}
      const {data:{user}}=await supabase.auth.getUser();
      if(!active)return;
      setSession(user?{...storedSession,user}:storedSession);
      setLoading(false);
    }

    void loadCurrentUser();
    return()=>{active=false;subscription.unsubscribe()};
  },[]);

  return <AuthContext.Provider value={{session,loading}}>{children}</AuthContext.Provider>
}

export const useAuth=()=>useContext(AuthContext);
