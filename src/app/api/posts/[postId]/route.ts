import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (
  request: NextRequest,
  { params }: { params: { postId: string } }
) => {
  console.log(`API にリクエストが届きました: postId=${params.postId}`);

  // `postId` を `number` に変換し、`NaN` チェック
  const postId = Number(params.postId);
  if (isNaN(postId)) {
    console.error(` 無効な postId: ${params.postId}`);
    return NextResponse.json(
      { status: "error", message: "無効な postId です" },
      { status: 400 }
    );
  }

  try {
    console.log(`DB から postId=${postId} の記事を取得します`);

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        postCategories: {
          include: {
            category: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    if (!post) {
      console.warn(`記事が見つかりませんでした: id=${postId}`);
      return NextResponse.json(
        { status: "error", message: "記事が見つかりません" },
        { status: 404 }
      );
    }

    console.log(`取得成功: id=${post.id}`, post);

    return NextResponse.json({ status: "OK", post }, { status: 200 });
  } catch (error) {
    console.error("データ取得エラー:", error);
    return NextResponse.json(
      { status: "error", message: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
};
