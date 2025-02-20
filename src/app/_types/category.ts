export type Category = {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

// `CategoryRequest` を使って型を統一
export type CreateCategoryRequest = Category;
export type UpdateCategoryRequest = Category;

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
