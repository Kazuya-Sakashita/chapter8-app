"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

type Props = {
  initialName?: string;
  categoryId?: string;
  onSubmit: (name: string) => void;
  buttonText: string;
  error: string | null;
  onDelete?: () => void;
};

const CategoryForm: React.FC<Props> = ({
  initialName = "",
  categoryId,
  onSubmit,
  buttonText,
  error,
  onDelete,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }, // isSubmitting を取得
  } = useForm<{ name: string }>({
    defaultValues: { name: initialName },
  });

  useEffect(() => {
    setValue("name", initialName);
  }, [initialName, setValue]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{buttonText}</h1>

      {error && <p className="text-red-500">{error}</p>}

      <form
        onSubmit={handleSubmit((data) => onSubmit(data.name))}
        className="bg-white p-4 border rounded-lg shadow-md"
      >
        <label className="block mb-2 font-bold">カテゴリ名</label>
        <input
          type="text"
          {...register("name", { required: "カテゴリ名は必須です" })}
          className="w-full p-2 border rounded"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        {/* `isSubmitting` を適用してボタンの二重クリック防止 */}
        <button
          type="submit"
          className="mr-4 mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "処理中..." : buttonText}
        </button>

        {categoryId && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="mr-4 mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            disabled={isSubmitting} // `isSubmitting` を適用
          >
            削除
          </button>
        )}
      </form>
    </div>
  );
};

export default CategoryForm;
