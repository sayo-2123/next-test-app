export interface Post {
  id: number;
  title: string;
  thumbnailUrl: string;
  createdAt: string;
  categories: string[];
  content: string;
}

export interface formData {
  name: string;
  email: string;
  message: string;
}

export interface ErrorMessages {
  name?: string;
  email?: string;
  message?: string;
}

export interface MicroCmsPost {
  id: string
  title: string
  content: string
  createdAt: string
  categories: { id: string; name: string }[]
  thumbnail: { url: string; height: number; width: number }
}
