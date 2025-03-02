// src/app/api/admin/posts/route.ts
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

    const formattedPosts = posts.map((post) => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      categories: post.postCategories.map(({ category }) => ({
        ...category,
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
