export interface BannerService {
  id: string
  name: string
  short_description: string
  description: string
  cover_image: string
  thumbnail: string
  category_id: string
  sub_category_id: string
  tax: number
  order_count: number
  is_active: number
  rating_count: number
  avg_rating: number
  min_bidding_price: string
  thumbnail_full_path: string
  cover_image_full_path: string
}

export interface BannerCategory {
  id: string
  parent_id: string
  name: string
  image: string
  position: number
  description: string | null
  is_active: number
  is_featured: number
  image_full_path: string
}

export interface BannerItem {
  id: string
  banner_title: string
  resource_type: "service" | "category"
  resource_id: string
  redirect_link: string | null
  banner_image: string
  banner_image_full_path: string
  is_active: number
  service: BannerService | null
  category: BannerCategory | null
}

export interface BannerResponse {
  response_code: string
  message: string
  content: {
    data: BannerItem[]
    current_page: number
    total: number
  }
  errors: any[]
}
