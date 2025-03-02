import { NextRequest, NextResponse } from "next/server"; // NextRequest と NextResponse をインポート
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"; // Supabaseクライアントをインポート

// トークンを検証する関数
export const verifyToken = async (
  req: NextRequest, // NextRequest 型を使用
  res: NextResponse // NextResponse 型を使用
) => {
  // Authorization ヘッダーからトークンを取得
  const token = req.headers.get("authorization")?.split(" ")[1]; // "Bearer <token>" 形式でトークンを取得
  console.log("サーバーに渡されたトークン:", token); // トークンをログに出力

  if (!token) {
    throw new Error("トークンが必要です");
  }

  // Supabaseクライアントを作成し、トークンを検証

  // TODO 型定義の問題があるが、動作しています。調査したが深そうだったので、後回しにします。
  const supabase = createServerSupabaseClient({ req, res }); // NextRequest と NextResponse をそのまま使用
  const { data: user, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    console.log("無効なトークン:", error); // トークンが無効な場合のログ
    throw new Error("無効なトークンです");
  }

  return user; // ユーザー情報が取得できたら返す
};
