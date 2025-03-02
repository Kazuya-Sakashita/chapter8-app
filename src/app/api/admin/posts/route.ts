import { NextRequest, NextResponse } from "next/server"; // NextRequest と NextResponse をインポート
import { PrismaClient } from "@prisma/client"; // Prismaクライアントをインポート
import { Category } from "@/app/_types/category"; // Category 型をインポート
import { CreatePostRequest } from "@/app/_types/post"; // CreatePostRequest 型をインポート
import { verifyToken } from "@/app/admin/_lib/auth"; // トークン検証関数をインポート

const prisma = new PrismaClient(); // Prismaクライアントをインスタンス化

// カテゴリデータを整形する関数
const formatCategories = (
  postCategories: {
    category: { id: number; name: string; createdAt: Date; updatedAt: Date };
  }[]
): Category[] =>
  postCategories.map(({ category }) => ({
    ...category, // `id, name` をそのままコピー
    createdAt: category.createdAt.toISOString(), // Date → string に変換
    updatedAt: category.updatedAt.toISOString(), // Date → string に変換
  }));

// GET: 記事一覧を取得
export async function GET() {
  try {
    // 投稿と関連するカテゴリデータを取得
    const posts = await prisma.post.findMany({
      include: {
        postCategories: {
          include: {
            category: true, // カテゴリも一緒に取得
          },
        },
      },
      orderBy: {
        createdAt: "desc", // 作成日順に並べ替え
      },
    });

    // データを整形して返す
    const formattedPosts = posts.map((post) => ({
      ...post, // `id, title, content, thumbnailImageKey` などをコピー
      createdAt: post.createdAt.toISOString(), // Date → string に変換
      updatedAt: post.updatedAt.toISOString(), // Date → string に変換
      categories: formatCategories(post.postCategories), // `postCategories` を `categories` に変換
    }));

    return NextResponse.json(
      { status: "OK", posts: formattedPosts },
      { status: 200 } // 成功した場合のレスポンス
    );
  } catch (error) {
    console.error("データ取得エラー:", error);
    return NextResponse.json(
      { error: "データの取得に失敗しました" },
      { status: 500 } // エラーが発生した場合のレスポンス
    );
  }
}

// POST: 記事作成
export const POST = async (request: NextRequest) => {
  try {
    const req = request; // NextRequest 型を使用
    const res = {} as NextResponse; // 空の NextResponse を作成

    // トークンを検証
    const authenticatedUser = await verifyToken(req, res); // トークン検証
    console.log("トークン検証成功:", authenticatedUser); // 検証成功時のログ

    // リクエストボディを取得
    const body = await request.json();
    const { title, content, categories, thumbnailImageKey }: CreatePostRequest =
      body;

    // データベース操作をトランザクションで行う
    const post = await prisma.$transaction(async (tx) => {
      const newPost = await tx.post.create({
        data: {
          title,
          content,
          thumbnailImageKey,
        },
      });

      await Promise.all(
        categories.map((categoryId) =>
          tx.postCategory.create({
            data: {
              postId: newPost.id,
              categoryId: Number(categoryId),
            },
          })
        )
      );

      return newPost;
    });

    // 成功時のレスポンス
    return NextResponse.json({
      status: "OK",
      message: "記事作成に成功しました",
      postId: post.id, // 作成された投稿のIDを返す
    });
  } catch (error: unknown) {
    console.error("記事作成エラー:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { status: "記事作成に失敗しました", error: error.message },
        {
          status:
            error.message === "トークンが必要です" ||
            error.message === "無効なトークンです"
              ? 401 // トークン関連のエラー
              : 500, // その他のサーバーエラー
        }
      );
    }

    return NextResponse.json(
      { status: "記事作成に失敗しました", error: "予期しないエラー" },
      { status: 500 }
    );
  }
};
