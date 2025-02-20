export type Category = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

// 共通の型として `CategoryRequest` を定義
export type CategoryRequest = {
  name: string;
};

// `CategoryRequest` を使って型を統一
export type CreateCategoryRequest = CategoryRequest;
export type UpdateCategoryRequest = CategoryRequest;

export type CategoryResponse = {
  status: "OK" | "error";
  category?: Category;
  message?: string;
};

export type DeleteCategoryResponse = {
  status: "OK" | "error";
  message: string;
  deletedCategory?: Category;
};
