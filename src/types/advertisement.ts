// types/advertisement.ts
export interface Coordinates {
  latitude: string;
  longitude: string;
}

export interface IdentificationImage {
  image: string;
  storage: string;
}

export interface Owner {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string;
  identification_number: string;
  identification_type: string;
  identification_image: IdentificationImage[];
  date_of_birth: string | null;
  gender: string;
  profile_image: string;
  fcm_token: string;
  is_phone_verified: number;
  is_email_verified: number;
  phone_verified_at: string | null;
  email_verified_at: string | null;
  is_active: number;
  user_type: string;
  remember_token: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  wallet_balance: number;
  loyalty_point: number;
  ref_code: string;
  referred_by: string | null;
  login_hit_count: number;
  is_temp_blocked: number;
  temp_block_time: string | null;
  current_language_key: string;
  profile_image_full_path: string | null;
  identification_image_full_path: string[];
  storage: string | null;
}

export interface Provider {
  id: string;
  user_id: string;
  company_name: string;
  company_phone: string;
  company_address: string;
  company_email: string;
  logo: string;
  contact_person_name: string;
  contact_person_phone: string;
  contact_person_email: string;
  order_count: number;
  service_man_count: number;
  service_capacity_per_day: number;
  rating_count: number;
  avg_rating: number;
  commission_status: number;
  commission_percentage: number;
  is_active: number;
  created_at: string;
  updated_at: string;
  is_approved: number;
  zone_id: string;
  coordinates: Coordinates;
  is_suspended: number;
  deleted_at: string | null;
  service_availability: number;
  cover_image: string | null;
  is_favorite: number;
  logo_full_path: string;
  cover_image_full_path: string | null;
  owner: Owner;
  subscribed_services: any[];
  storage: string | null;
}

export interface Translation {
  id: number;
  translationable_type: string;
  translationable_id: string;
  locale: string;
  key: string;
  value: string;
}

export interface Advertisement {
  id: string;
  readable_id: string;
  title: string;
  description: string;
  provider_id: string;
  priority: number;
  type: string;
  is_paid: number;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  updated_at: string;
  is_updated: number;
  provider_profile_image_full_path: string;
  provider_cover_image_full_path: string;
  promotional_video_full_path: string | null;
  provider_review: string;
  provider_rating: string;
  default_title: string;
  default_description: string;
  provider: Provider;
  translations: Translation[];
}

export interface Link {
  url: string | null;
  label: string;
  active: boolean;
}

export interface AdvertisementContent {
  current_page: number;
  data: Advertisement[];
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

export interface AdvertisementResponse {
  response_code: string;
  message: string;
  content: AdvertisementContent;
  errors: any[];
}
