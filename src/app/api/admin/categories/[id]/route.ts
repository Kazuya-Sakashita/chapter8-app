import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json({ status: "OK", category }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

// カテゴリーの更新時に送られてくるリクエストのbodyの型
interface UpdateCategoryRequestBody {
  name: string;
}

// PUT リクエスト: 記事の更新
export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const {
    title,
    content,
    categories,
    thumbnailUrl,
  }: {
    title: string;
    content: string;
    categories: { id: number }[];
    thumbnailUrl: string;
  } = await request.json();

  // `id` を数値に変換
  const postId = parseInt(id);
  if (isNaN(postId)) {
    return NextResponse.json(
      { status: "error", message: "無効な postId です" },
      { status: 400 }
    );
  }

  try {
    // 投稿を更新
    const post = await prisma.post.update({
      where: { id: postId },
      data: { title, content, thumbnailUrl },
    });

    // 既存のポストカテゴリーを削除
    await prisma.postCategory.deleteMany({
      where: { postId: post.id },
    });

    // 新しいカテゴリを追加
    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          postId: post.id,
          categoryId: category.id,
        },
      });
    }

    return NextResponse.json({ status: "OK", post: post }, { status: 200 });
  } catch (error) {
    // errorをError型にキャスト
    if (error instanceof Error) {
      console.error("更新エラー:", error);
      return NextResponse.json(
        { status: "error", message: error.message },
        { status: 400 }
      );
    }
    // `error` が `Error` 型でない場合のフォールバック
    return NextResponse.json(
      { status: "error", message: "不明なエラーが発生しました" },
      { status: 500 }
    );
  }
};
