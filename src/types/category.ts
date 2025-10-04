// types/category.ts
export interface Translation {
  id: number;
  translationable_type: string;
  translationable_id: string;
  locale: string;
  key: string;
  value: string;
}

export interface Category {
  id: string;
  parent_id: string;
  name: string;
  image: string;
  position: number;
  description: string;
  is_active: number;
  is_featured: number;
  created_at: string;
  updated_at: string;
  services_count: number;
  image_full_path: string;
  translations: Translation[];
  storage: string | null;
}

export interface Link {
  url: string | null;
  label: string;
  active: boolean;
}

export interface CategoryContent {
  current_page: number;
  data: Category[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface CategoryResponse {
  response_code: string;
  message: string;
  content: CategoryContent;
  errors: any[];
}