import { MicroCmsPost } from "../_types/MicroCmsPost";

const apiUrl = process.env.NEXT_PUBLIC_MICROCMS_API_URL;
const apiKey = process.env.NEXT_PUBLIC_MICROCMS_API_KEY;

if (!apiUrl || !apiKey) {
  throw new Error("環境変数が正しく設定されていません");
}

/**
 * MicroCMS から記事一覧を取得する (MicroCmsPost 型に合わせる)
 */
export const fetchPosts = async (): Promise<MicroCmsPost[]> => {
  console.log("Fetching posts from MicroCMS...");

  // `fields` に `categories` を明示的に指定
  const response = await fetch(
    `${apiUrl}/posts?fields=id,title,content,createdAt,categories,thumbnail`,
    {
      headers: {
        "X-MICROCMS-API-KEY": apiKey,
      },
    }
  );

  if (!response.ok) {
    console.error(
      "Error fetching posts:",
      response.status,
      response.statusText
    );
    throw new Error("データの取得に失敗しました");
  }

  const data: { contents: MicroCmsPost[] } = await response.json();

  console.log("Fetched data:", JSON.stringify(data, null, 2)); // 🔹 API のレスポンスを確認

  return data.contents.map((post: MicroCmsPost) => {
    console.log(`Processing post ID: ${post.id}`);
    console.log(`Categories for post ID ${post.id}:`, post.categories);

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      categories: post.categories ?? [], // `categories` が `undefined` の場合は空配列をセット
      thumbnail: post.thumbnail || { url: "", height: 0, width: 0 },
    };
  });
};

/**
 * MicroCMS から記事詳細を取得する (`id` を使用)
 */
export const fetchPostById = async (id: string): Promise<MicroCmsPost> => {
  const response = await fetch(`${apiUrl}/posts/${id}`, {
    headers: {
      "X-MICROCMS-API-KEY": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error("データの取得に失敗しました");
  }

  const post: MicroCmsPost = await response.json();

  return {
    id: post.id,
    title: post.title,
    content: post.content,
    createdAt: post.createdAt,
    categories: post.categories ?? [],
    thumbnail: post.thumbnail || { url: "", height: 0, width: 0 },
  };
};
