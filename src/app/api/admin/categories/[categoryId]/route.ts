import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/app/admin/_lib/auth"; // トークン検証関数をインポート

const prisma = new PrismaClient();

// GET リクエスト: 特定のカテゴリを取得
export const GET = async (
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) => {
  const { categoryId } = params;

  try {
    // GET リクエストに対してトークン検証は不要
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(categoryId),
      },
    });

    return NextResponse.json({ status: "OK", category }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

// PUT リクエスト: カテゴリの更新
export const PUT = async (
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) => {
  const { categoryId } = params;
  const { name }: { name: string } = await request.json();

  // トークンを検証
  const authenticatedUser = await verifyToken(request, request); // トークン検証
  console.log("トークン検証成功:", authenticatedUser); // トークン検証が成功した場合にユーザー情報をログに出力

  // `id` を数値に変換
  const categoryIdNumber = parseInt(categoryId);
  if (isNaN(categoryIdNumber)) {
    return NextResponse.json(
      { status: "error", message: "無効な categoryId です" },
      { status: 400 }
    );
  }

  try {
    // カテゴリを更新
    const category = await prisma.category.update({
      where: { id: categoryIdNumber },
      data: { name },
    });

    return NextResponse.json({ status: "OK", category }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("更新エラー:", error);
      return NextResponse.json(
        { status: "error", message: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { status: "error", message: "不明なエラーが発生しました" },
      { status: 500 }
    );
  }
};

// DELETE リクエスト: カテゴリの削除
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) => {
  const { categoryId } = params;

  // トークンを検証
  const authenticatedUser = await verifyToken(request, request); // トークン検証
  console.log("トークン検証成功:", authenticatedUser); // トークン検証が成功した場合にユーザー情報をログに出力

  // `id` を数値に変換
  const categoryIdNumber = parseInt(categoryId);
  if (isNaN(categoryIdNumber)) {
    return NextResponse.json(
      { status: "error", message: "無効な categoryId です" },
      { status: 400 }
    );
  }

  try {
    // カテゴリを削除
    const deletedCategory = await prisma.category.delete({
      where: { id: categoryIdNumber },
    });

    return NextResponse.json(
      { status: "OK", message: "カテゴリを削除しました", deletedCategory },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("削除エラー:", error);
      return NextResponse.json(
        { status: "error", message: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { status: "error", message: "不明なエラーが発生しました" },
      { status: 500 }
    );
  }
};
