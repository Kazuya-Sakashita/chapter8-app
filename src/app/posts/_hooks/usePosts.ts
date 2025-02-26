import useSWR from "swr";
import { fetcher } from "@/app/lib/fetcher";

export const usePosts = () => {
  const { data, error, isLoading, mutate } = useSWR("/api/posts", fetcher);
  console.log("data:", data);

  return {
    posts: data?.posts || [],
    isLoading,
    isError: error,
    mutate,
  };
};
