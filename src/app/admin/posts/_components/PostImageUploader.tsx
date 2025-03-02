"use client";

import { ChangeEvent } from "react";
import { useWatch, Control, UseFormSetValue } from "react-hook-form";
import { supabase } from "@/utils/supabase";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import Label from "@/app/contact/form/Label";

// フォームデータの型を定義
type PostFormData = {
  title: string;
  content: string;
  thumbnailImageKey: string;
  categories: number[];
};

type PostImageUploaderProps = {
  control: Control<PostFormData>; // useForm の control
  setValue: UseFormSetValue<PostFormData>; // useForm の setValue
};

const PostImageUploader: React.FC<PostImageUploaderProps> = ({
  control,
  setValue,
}) => {
  // useWatch でリアルタイム監視
  const thumbnailImageKey = useWatch({ control, name: "thumbnailImageKey" });

  // サムネイル画像のURLを取得
  const thumbnailImageUrl = thumbnailImageKey
    ? supabase.storage.from("post_thumbnail").getPublicUrl(thumbnailImageKey)
        .data.publicUrl
    : null;

  // 画像ファイルが選択された場合の処理
  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const filePath = `private/${uuidv4()}`;

    const { error } = await supabase.storage
      .from("post_thumbnail")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (error) {
      alert(error.message);
      return;
    }

    setValue("thumbnailImageKey", filePath); // useForm に値をセット
  };

  return (
    <div className="flex flex-col mb-6">
      <Label htmlFor="thumbnailImageKey">サムネイル画像</Label>

      {/* 現在のサムネイル画像 */}
      {thumbnailImageUrl && (
        <div className="relative w-24 h-24 mb-4">
          <Image
            src={thumbnailImageUrl}
            alt="サムネイル画像"
            layout="fill"
            className="object-cover rounded-lg"
          />
        </div>
      )}

      {/* 新しい画像アップロード */}
      <input
        id="thumbnailImageKey"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="p-2 border rounded-lg"
      />
    </div>
  );
};

export default PostImageUploader;
