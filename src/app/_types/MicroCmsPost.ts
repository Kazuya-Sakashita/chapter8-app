export interface MicroCmsPost {
  id: string; // microCmsの場合はid:stringが一般的
  title: string;
  content: string;
  createdAt: string;
  categories: { id: string; name: string }[];
  thumbnail: { url: string; height: number; width: number };
}
