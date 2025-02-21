import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Post の一覧を取得
    const posts = await prisma.post.findMany({
      include: {
        postCategories: {
          include: {
            category: true, // カテゴリ情報を取得
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("DB取得データ:", JSON.stringify(posts, null, 2));

    // `Date` 型のフィールドを `ISO 8601` 文字列に変換
    const formattedPosts = posts.map((post) => ({
      ...post, // `id, title, content, thumbnailUrl` をそのままコピー
      createdAt: post.createdAt.toISOString(), // Date → string に変換
      updatedAt: post.updatedAt.toISOString(), // Date → string に変換
      categories: post.postCategories.map(({ category }) => ({
        ...category, // `id, name` をそのままコピー
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
