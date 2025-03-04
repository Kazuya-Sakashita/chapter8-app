"use client";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession"; // Supabaseセッションを取得するカスタムフック
import { useRouter } from "next/navigation"; // Next.jsのルーティングを管理するためのフック
import Link from "next/link"; // リンクを作成するためのコンポーネント
import { supabase } from "@/utils/supabase"; // Supabaseのインスタンスをインポート

// Navbar コンポーネントの定義
const Navbar: React.FC = function Navbar() {
  // useSupabaseSessionフックを使用して、現在のセッション情報（ログイン状態）を取得
  const { session, isLoding } = useSupabaseSession(); // session（ログインしている場合の情報）とisLoding（読み込み中かどうか）を取得
  const router = useRouter(); // ログアウト後にページ遷移するためのフック

  // ログアウト処理
  const handleLogout = async () => {
    // Supabaseのauth.signOut()を使ってユーザーをサインアウトさせる
    await supabase.auth.signOut();
    // サインアウトが成功したら、セッションをリセット
    router.push("/login"); // ログインページに遷移
  };

  // ログイン状態の読み込み中は何も表示しない
  if (isLoding) {
    return null; // 読み込み中は何も表示せず、処理を終了
  }

  return (
    <nav className="bg-gray-800 text-white w-full">
      <div className="container mx-auto flex justify-between items-center p-6">
        {/* ブログホームへのリンク */}
        <Link href="/" className="text-base font-bold">
          Blog
        </Link>
        {/* メニューアイテムを表示する */}
        <ul className="flex space-x-4">
          {session === undefined ? (
            // セッション確認中（ローディング中）
            <li className="text-gray-400">セッション確認中...</li>
          ) : session === null ? (
            // 未ログイン
            <>
              <li className="text-red-400">未ログインです</li>
              <li>
                <Link href="/login" className="text-base font-bold">
                  ログイン
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-base font-bold">
                  サインアップ
                </Link>
              </li>
            </>
          ) : (
            // ログイン済み
            <>
              <Link href="/admin/posts" className="header-link">
                管理画面
              </Link>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-base font-bold text-red-500"
                >
                  ログアウト
                </button>
              </li>
            </>
          )}
          {/* お問い合わせページへのリンク */}
          <li>
            <Link href="/contact" className="text-base font-bold">
              お問い合わせ
            </Link>
          </li>
        </ul>{" "}
      </div>
    </nav>
  );
};

export default Navbar;
