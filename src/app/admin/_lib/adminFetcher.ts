/**
 * Admin専用の認証付きデータ取得用 fetcher
 * @param url APIエンドポイントのURL
 * @param token 認証トークン
 * @returns JSONデータ
 */
export const adminFetcher = async ([url, token]: [string, string | null]) => {
  if (!token) {
    throw new Error("認証トークンがありません");
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("データの取得に失敗しました");
  }

  return response.json();
};
