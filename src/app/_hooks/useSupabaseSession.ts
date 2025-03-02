import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

export const useSupabaseSession = () => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null);
  const [isLoding, setIsLoding] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setToken(session?.access_token || null);
      setIsLoding(false);
    };

    fetchSession();

    // セッションの変更を監視
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setSession(session);
        setToken(session?.access_token || null);
      }
    );

    // コンポーネントがアンマウントされる際にリスナーを解除
    return () => {
      authListener?.subscription?.unsubscribe(); // 修正箇所
    };
  }, []);

  return { session, isLoding, token };
};
