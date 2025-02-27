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
    // サインアウトが成功したら、ログインページに遷移
    router.push("/login");
  };

  // ログイン状態の読み込み中は何も表示しない
  if (isLoding) {
    return null; // 読み込み中は何も表示せず、処理を終了
  }

  return (
    <nav className="bg-gray-800 text-white w-full">
      {" "}
      {/* ナビゲーションバーのスタイル */}
      <div className="container mx-auto flex justify-between items-center p-6">
        {" "}
        {/* ナビゲーションバー内の配置 */}
        {/* ブログホームへのリンク */}
        <Link href="/" className="text-base font-bold">
          Blog
        </Link>
        {/* メニューアイテムを表示する */}
        <ul className="flex space-x-4">
          {/* sessionがない（未ログイン）場合 */}
          {!session ? (
            <>
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
            // sessionがある（ログインしている）場合
            <>
              <li>
                <Link href="/profile" className="text-base font-bold">
                  プロフィール
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout} // ログアウトボタンがクリックされたらhandleLogout関数を実行
                  className="text-base font-bold text-red-500" // ログアウトボタンのスタイル
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
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
