import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Fetch all posts with their categories
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
      id: post.id,
      title: post.title,
      content: post.content,
      thumbnailUrl: post.thumbnailUrl,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      categories: post.postCategories.map((pc) => ({
        id: pc.category.id,
        name: pc.category.name,
      })),
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

// 記事作成のリクエストボディの型
interface CreatePostRequestBody {
  title: string;
  content: string;
  categories: number[]; // カテゴリのID配列
  thumbnailUrl: string;
}

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const { title, content, categories, thumbnailUrl }: CreatePostRequestBody =
    body;

  try {
    const post = await prisma.$transaction(async (tx) => {
      const newPost = await tx.post.create({
        data: {
          title,
          content,
          thumbnailUrl,
        },
      });

      // カテゴリと投稿の関連を中間テーブルに追加
      for (const categoryId of categories) {
        // `categoryId` の型が正しいか確認してから送信
        await tx.postCategory.create({
          data: {
            postId: newPost.id,
            categoryId: categoryId, // `categoryId` が数値型で送信されていることを確認
          },
        });
      }

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
