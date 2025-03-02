import { verifyToken } from "@/app/admin/_lib/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    // カテゴリーの一覧をDBから取得
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc", // 作成日時の降順で取得
      },
    });

    // レスポンスを返す
    return NextResponse.json({ status: "OK", categories }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

// カテゴリーの作成時に送られてくるリクエストのbodyの型
interface CreateCategoryRequestBody {
  name: string;
}

export const POST = async (request: Request) => {
  try {
    const req = request; // NextRequest 型を使用
    const res = {} as NextResponse; // 空の NextResponse を作成

    // トークンを検証
    const authenticatedUser = await verifyToken(req, res); // トークン検証
    console.log("トークン検証成功:", authenticatedUser); // 検証成功時のログ

    // リクエストのbodyを取得
    const body = await request.json();

    // bodyの中からnameを取り出す
    const { name }: CreateCategoryRequestBody = body;

    // カテゴリーをDBに生成
    const data = await prisma.category.create({
      data: {
        name,
      },
    });

    // レスポンスを返す
    return NextResponse.json({
      status: "OK",
      message: "作成しました",
      id: data.id,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};
