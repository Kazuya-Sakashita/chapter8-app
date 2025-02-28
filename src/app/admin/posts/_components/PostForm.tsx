"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import Input from "@/app/contact/form/Input";
import Label from "@/app/contact/form/Label";
import { Post } from "@/app/_types/post";
import { supabase } from "@/utils/supabase"; // Supabaseインスタンスをインポート
import { v4 as uuidv4 } from "uuid"; // 固有IDを生成するライブラリ
import Image from "next/image"; // Next.js Imageをインポート
import { useAdminCategories } from "../../categories/_hooks/useAdminCategories";

type PostFormProps = {
  initialData?: Post;
  onSubmit: (postData: {
    title: string;
    content: string;
    thumbnailImageKey: string;
    categories: number[];
  }) => void;
  onDelete?: () => void;
  buttonText: string;
};

const PostForm: React.FC<PostFormProps> = ({
  initialData,
  onSubmit,
  onDelete,
  buttonText,
}) => {
  const { categories, isLoading: isCategoriesLoading } = useAdminCategories();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      thumbnailImageKey: initialData?.thumbnailImageKey || "",
      categories: initialData?.categories?.map((category) => category.id) || [],
    },
  });

  const [thumbnailImageKey, setThumbnailImageKey] = useState<string>(
    initialData?.thumbnailImageKey || ""
  );
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string | null>(
    null
  );

  // 初期データがある場合にフォームにセットする
  useEffect(() => {
    if (initialData) {
      setValue("title", initialData.title);
      setValue("content", initialData.content);
      setValue("thumbnailImageKey", initialData.thumbnailImageKey);
      setValue(
        "categories",
        initialData.categories.map((category) => category.id)
      );
    }
  }, [initialData, setValue]);

  // 画像URLを取得して表示する
  useEffect(() => {
    if (!thumbnailImageKey) return;

    const fetchImageUrl = async () => {
      const { data } = await supabase.storage
        .from("post_thumbnail")
        .getPublicUrl(thumbnailImageKey);

      if (!data) {
        console.error("Error fetching image URL: No data received");
        return;
      }

      setThumbnailImageUrl(data.publicUrl);
    };

    fetchImageUrl();
  }, [thumbnailImageKey]);

  // 画像ファイルが選択された場合の処理
  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    const filePath = `private/${uuidv4()}`;

    const { data, error } = await supabase.storage
      .from("post_thumbnail")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (error) {
      alert(error.message);
      return;
    }

    setThumbnailImageKey(data?.path || "");
  };

  // フォーム送信時の処理
  const handleSubmitForm = async (data: {
    title: string;
    content: string;
    categories: number[];
  }) => {
    const postData = {
      ...data,
      thumbnailImageKey, // 画像のキーを追加
    };

    try {
      await onSubmit(postData);
    } catch (error) {
      console.error("記事作成エラー:", error);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto py-10">
      <h1 className="text-xl font-bold mb-10">{buttonText}</h1>

      <form onSubmit={handleSubmit(handleSubmitForm)}>
        {/* タイトル入力 */}
        <div className="flex flex-col mb-6">
          <Label htmlFor="title">タイトル</Label>
          <Input
            id="title"
            {...register("title", { required: "タイトルは必須です" })}
            placeholder="記事のタイトルを入力"
          />
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* 内容入力 */}
        <div className="flex flex-col mb-6">
          <Label htmlFor="content">内容</Label>
          <Input
            id="content"
            as="textarea"
            rows={8}
            {...register("content", { required: "内容は必須です" })}
            placeholder="記事の内容を入力"
          />
          {errors.content && (
            <p className="text-red-500">{errors.content.message}</p>
          )}
        </div>

        {/* 現在のサムネイル画像があれば表示 */}
        {thumbnailImageUrl && (
          <div className="flex flex-col mb-6">
            <Label htmlFor="thumbnailImageKey">現在のサムネイル画像</Label>
            <div className="relative w-24 h-24 mb-4">
              <Image
                src={thumbnailImageUrl}
                alt="サムネイル画像"
                layout="fill"
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        )}

        {/* 新しいサムネイル画像アップロード */}
        <div className="flex flex-col mb-6">
          <Label htmlFor="thumbnailImageKey">サムネイル画像</Label>
          <input
            id="thumbnailImageKey"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="p-2 border rounded-lg"
          />
          {errors.thumbnailImageKey && (
            <p className="text-red-500">{errors.thumbnailImageKey.message}</p>
          )}
        </div>

        {/* カテゴリ選択 */}
        <div className="flex flex-col mb-6">
          <Label htmlFor="categories">カテゴリー</Label>
          {isCategoriesLoading ? (
            <p>カテゴリを読み込み中...</p>
          ) : (
            <Controller
              control={control}
              name="categories"
              render={({ field }) => (
                <select
                  id="categories"
                  multiple
                  className="p-2 border rounded-lg"
                  value={field.value.map(String)}
                  onChange={(e) =>
                    field.onChange(
                      Array.from(e.target.selectedOptions, (opt) =>
                        Number(opt.value)
                      )
                    )
                  }
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            />
          )}
        </div>

        {/* ボタン */}
        <div className="flex justify-center mt-10">
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg"
            disabled={isSubmitting} // 送信中はボタンを無効化
          >
            {isSubmitting ? "処理中..." : buttonText}
          </button>

          {/* 削除ボタン（編集時のみ表示） */}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg ml-4"
              disabled={isSubmitting}
            >
              削除
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PostForm;
