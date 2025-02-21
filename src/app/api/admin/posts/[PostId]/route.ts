import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET リクエスト: 特定のポストを取得
export const GET = async (
  request: NextRequest,
  { params }: { params: { postId: string } }
) => {
  console.log(`API にリクエストが届きました: postId=${params.postId}`);

  // `postId` を `number` に変換し、`NaN` チェック
  const postId = parseInt(params.postId);
  if (isNaN(postId)) {
    console.error(`無効な postId: ${params.postId}`);
    return NextResponse.json(
      { status: "error", message: "無効な postId です" },
      { status: 400 }
    );
  }

  try {
    console.log(`DB から postId=${postId} の記事を取得します`);

    // ポストと関連するカテゴリーを取得
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        postCategories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // ポストが見つからない場合
    if (!post) {
      console.warn(`記事が見つかりませんでした: id=${postId}`);
      return NextResponse.json(
        { status: "error", message: "記事が見つかりません" },
        { status: 404 }
      );
    }

    console.log(`取得成功: id=${post.id}`, post);
    return NextResponse.json({ status: "OK", post: post }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("データ取得エラー:", error.message);
      return NextResponse.json(
        { status: "error", message: error.message },
        { status: 500 }
      );
    }
    console.error("不明なエラー:", error);
    return NextResponse.json(
      { status: "error", message: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
};

// PUT リクエスト: 記事の更新
export const PUT = async (
  request: NextRequest,
  { params }: { params: { postId: string } }
) => {
  const { postId } = params;

  // postIdが文字列であれば数値に変換
  const postIdNumber = parseInt(postId, 10); // 10は基数（通常は10進数）

  // postIdがNaNでないか確認
  if (isNaN(postIdNumber)) {
    console.error(`無効な postId: ${postId}`);
    return NextResponse.json(
      { status: "error", message: "無効な postId です" },
      { status: 400 }
    );
  }

  // リクエストのデータを受け取る
  const {
    title,
    content,
    categories,
    thumbnailUrl,
  }: {
    title: string;
    content: string;
    categories: number[];
    thumbnailUrl: string;
  } = await request.json();

  try {
    // トランザクションを使って一連の操作をまとめる
    const result = await prisma.$transaction(async (prisma) => {
      // 投稿を更新
      const post = await prisma.post.update({
        where: { id: postIdNumber },
        data: { title, content, thumbnailUrl },
      });

      // 既存のポストカテゴリーを削除
      await prisma.postCategory.deleteMany({
        where: { postId: post.id },
      });

      // 新しいカテゴリを追加
      if (categories.length > 0) {
        const categoryData = categories.map((categoryId) => ({
          postId: post.id,
          categoryId: categoryId,
        }));
        await prisma.postCategory.createMany({
          data: categoryData,
        });
      }

      return post;
    });

    // 更新が成功した場合
    return NextResponse.json({ status: "OK", post: result }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("更新エラー:", error.message);
      return NextResponse.json(
        { status: "error", message: error.message },
        { status: 400 }
      );
    }
    console.error("不明なエラー:", error);
    return NextResponse.json(
      { status: "error", message: "不明なエラーが発生しました" },
      { status: 500 }
    );
  }
};

// DELETE リクエスト: 記事の削除
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { postId: string } }
) => {
  // params.postIdを直接アクセス
  const postId = parseInt(params.postId);

  // postIdがNaNでないか確認
  if (isNaN(postId)) {
    console.error(`無効な postId: ${params.postId}`);
    return NextResponse.json(
      { status: "error", message: "無効な postId です" },
      { status: 400 }
    );
  }

  try {
    // 投稿を削除
    await prisma.post.delete({
      where: { id: postId },
    });

    // 中間テーブルの削除
    await prisma.postCategory.deleteMany({
      where: { postId: postId }, // postIdに基づいて削除
    });

    return NextResponse.json({ status: "OK" }, { status: 200 });
  } catch (error) {
    console.error("削除エラー:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "不明なエラー",
      },
      { status: 500 }
    );
  }
};
