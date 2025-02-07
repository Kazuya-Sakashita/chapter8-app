"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import Input from "../form/Input";
import Label from "../form/Label";

interface ContactFormInputs {
  name: string;
  email: string;
  message: string;
}

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInputs>({ mode: "onSubmit" });

  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit: SubmitHandler<ContactFormInputs> = async (data) => {
    console.log("送信データ:", data);
    setSubmitStatus(null);
    setIsSubmitting(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          signal: controller.signal,
          keepalive: true,
        }
      );

      clearTimeout(timeoutId);

      const responseData = await response.json();
      console.log("APIレスポンス:", responseData);

      if (!response.ok) {
        throw new Error(responseData?.message || "送信に失敗しました");
      }

      setSubmitStatus("success");
      reset();
    } catch (error: unknown) {
      // `unknown` を使う
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          console.error("リクエストがタイムアウトしました");
        } else {
          console.error("エラー:", error.message);
        }
      } else {
        console.error("予期しないエラーが発生しました");
      }
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto py-10">
      <h1 className="text-xl font-bold mb-10">問い合わせフォーム</h1>

      {/* 送信成功 / 失敗のメッセージを追加 */}
      {submitStatus === "success" && (
        <p className="text-green-600 text-center mb-4">送信が完了しました！</p>
      )}
      {submitStatus === "error" && (
        <p className="text-red-600 text-center mb-4">
          送信に失敗しました。もう一度お試しください。
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center mb-6">
          <Label htmlFor="name">お名前</Label>
          <Input
            id="name"
            {...register("name", {
              required: "お名前は必須です。",
              maxLength: {
                value: 30,
                message: "30文字以内で入力してください。",
              },
            })}
            errors={errors?.name}
            placeholder="お名前を入力"
          />
        </div>

        <div className="flex justify-between items-center mb-6">
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            id="email"
            type="email"
            {...register("email", {
              required: "メールアドレスは必須です。",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "正しいメールアドレスを入力してください。",
              },
            })}
            errors={errors?.email}
            placeholder="メールアドレスを入力"
          />
        </div>

        <div className="flex justify-between items-center mb-6">
          <Label htmlFor="message">本文</Label>
          <Input
            id="message"
            as="textarea"
            rows={8}
            {...register("message", {
              required: "本文は必須です。",
              maxLength: {
                value: 500,
                message: "本文は500文字以内で入力してください。",
              },
            })}
            errors={errors?.message}
            placeholder="本文を入力"
          />
        </div>

        <div className="flex justify-center mt-10">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gray-800 text-white font-bold py-2 px-4 rounded-lg mr-4"
          >
            {isSubmitting ? "送信中..." : "送信"}
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="py-3 px-6 font-bold text-gray-800 bg-gray-200 hover:bg-gray-300 rounded-lg shadow-lg transition-all"
          >
            クリア
          </button>
        </div>
      </form>
    </div>
  );
}
