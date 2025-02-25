"use client";

import { SWRConfig } from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        refreshInterval: 5000, // 5秒ごとにデータを更新
        dedupingInterval: 2000, // 2秒以内の同じリクエストを抑制
        revalidateOnFocus: true, // 画面がフォーカスされたら再フェッチ
      }}
    >
      {children}
    </SWRConfig>
  );
}
