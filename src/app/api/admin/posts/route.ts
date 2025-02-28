import { NextResponse, NextRequest } from "next/server"; // ✅ NextRequest を追加
import { PrismaClient } from "@prisma/client";
import { Category } from "@/app/_types/category";
import { CreatePostRequest } from "@/app/_types/post";

const prisma = new PrismaClient();

// カテゴリデータを整形する関数
const formatCategories = (
  postCategories: {
    category: { id: number; name: string; createdAt: Date; updatedAt: Date };
  }[]
): Category[] =>
  postCategories.map(({ category }) => ({
    ...category, // `id, name` をそのままコピー
    createdAt: category.createdAt.toISOString(), // Date → string
    updatedAt: category.updatedAt.toISOString(), // Date → string
  }));

// ✅ GET: 記事一覧を取得
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        postCategories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedPosts = posts.map((post) => ({
      ...post, // `id, title, content, thumbnailImageKey` などをコピー
      createdAt: post.createdAt.toISOString(), // Date → string に変換
      updatedAt: post.updatedAt.toISOString(), // Date → string に変換
      categories: formatCategories(post.postCategories), // `postCategories` を `categories` に変換
    }));

    return NextResponse.json(
      { status: "OK", posts: formattedPosts },
      { status: 200 }
    );
  } catch (error) {
    console.error("データ取得エラー:", error);
    return NextResponse.json(
      { error: "データの取得に失敗しました" },
      { status: 500 }
    );
  }
}

//  POST: 記事作成
export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const { title, content, categories, thumbnailImageKey }: CreatePostRequest =
    body;

  try {
    const post = await prisma.$transaction(async (tx) => {
      const newPost = await tx.post.create({
        data: {
          title,
          content,
          thumbnailImageKey,
        },
      });

      // カテゴリと投稿の関連を中間テーブルに追加
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

    return NextResponse.json({
      status: "OK",
      message: "記事作成に成功しました",
      postId: post.id,
    });
  } catch (error) {
    console.error("記事作成エラー:", error);
    return NextResponse.json(
      { status: "記事作成に失敗しました" },
      { status: 500 }
    );
  }
};
