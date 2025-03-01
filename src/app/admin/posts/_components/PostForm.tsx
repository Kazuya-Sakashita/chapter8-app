"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Input from "@/app/contact/form/Input";
import Label from "@/app/contact/form/Label";
import { Post } from "@/app/_types/post";
import { useAdminCategories } from "../../categories/_hooks/useAdminCategories";
import PostImageUploader from "./PostImageUploader"; // 画像アップローダーをインポート

type PostFormData = {
  title: string;
  content: string;
  thumbnailImageKey: string;
  categories: number[];
};

type PostFormProps = {
  initialData?: Post;
  onSubmit: (postData: PostFormData) => void;
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
  } = useForm<PostFormData>({
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      thumbnailImageKey: initialData?.thumbnailImageKey || "",
      categories: initialData?.categories?.map((category) => category.id) || [],
    },
  });

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

  return (
    <div className="max-w-[800px] mx-auto py-10">
      <h1 className="text-xl font-bold mb-10">{buttonText}</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
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

        {/* 画像アップローダー */}
        <PostImageUploader control={control} setValue={setValue} />

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
            disabled={isSubmitting}
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
