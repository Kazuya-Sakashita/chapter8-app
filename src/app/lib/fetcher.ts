// fetcher.ts
export const fetcher = async (url: string, token: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // トークンをAuthorizationヘッダーに追加
    },
  });

  // レスポンスの詳細をコンソールに出力
  console.log("Response:", response);

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
};
