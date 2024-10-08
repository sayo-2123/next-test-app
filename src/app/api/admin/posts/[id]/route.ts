import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getCurrentUser } from '@/utils/supabase';

const prisma = new PrismaClient();

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } } //ここでリクエストパラメータを受け取る
) => {
  //paramsの中にidが入っているので、それを取り出す

  //認可
  const { error } = await getCurrentUser(request);
  if (error)
    return NextResponse.json({ status: 'Unauthorized' }, { status: 400 });

  const { id } = params;
  try {
    // Postの一覧をDBから取得
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
      // カテゴリ含めて取得
      include: {
        postCategories: {
          include: {
            category: {
              //　カテゴリのidとnameだけ取得
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json({ status: 'OK', post }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } } //リクエストパラメータを受け取る
) => {
  const { error } = await getCurrentUser(request);
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });

  //paramsの中のidを取り出す
  const { id } = params;
  //リクエストのbodyを取得
  const { title, content, categories, thumbnailImageKey } =
    await request.json();
  try {
    const post = await prisma.post.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        content,
        thumbnailImageKey,
      },
    });

    //記事とカテゴリーの中間テーブルのレコードを全て削除
    await prisma.postCategory.deleteMany({
      where: {
        postId: parseInt(id),
      },
    });

    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          postId: post.id,
          categoryId: category.id,
        },
      });
    }
  } catch {}
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } } // ここでリクエストパラメータを受け取る
) => {
  const { error } = await getCurrentUser(request);
  
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });
  
  // paramsの中にidが入っているのでそれを取り出す
  const { id } = params;
  try {
    //idを指定して、Postを削除
    await prisma.post.delete({
      where: {
        id: parseInt(id),
      },
    });

    //レスポンスを返す
    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};
