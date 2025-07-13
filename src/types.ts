export interface Song {
  id: string;
  name: string;
  author: string;
  performers: string[];
  image: string;
  lyric: string;
  ref_urls: string[];
  categories: string[];
  tags: string[];
  scores: number[]; // Mảng các điểm vote từ 1-5 sao
  last_sung_at: string | null;
  sing_count: number;
  priority: number;
  last_update: string;
  created_at: string;
} 