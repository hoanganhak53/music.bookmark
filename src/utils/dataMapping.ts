import { Song } from '@/types';

// Interface cho database response (snake_case)
interface DatabaseSong {
  id: string;
  name: string;
  author: string;
  performers: string[];
  image: string;
  lyric: string;
  ref_urls: string[];
  categories: string[];
  tags: string[];
  scores: number[];
  last_sung_at: string | null;
  sing_count: number;
  priority: number;
  last_update: string;
  created_at: string;
}

// Type guard để kiểm tra database response
export function isDatabaseSong(obj: any): obj is DatabaseSong {
  return obj && 
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.author === 'string' &&
    Array.isArray(obj.performers) &&
    typeof obj.image === 'string' &&
    typeof obj.lyric === 'string' &&
    Array.isArray(obj.ref_urls) &&
    Array.isArray(obj.categories) &&
    Array.isArray(obj.tags) &&
    Array.isArray(obj.scores) &&
    (obj.last_sung_at === null || typeof obj.last_sung_at === 'string') &&
    typeof obj.sing_count === 'number' &&
    typeof obj.priority === 'number' &&
    typeof obj.last_update === 'string' &&
    typeof obj.created_at === 'string';
}

// Convert database response (snake_case) to frontend format (camelCase)
export function mapDatabaseToFrontend(dbSong: DatabaseSong): Song {
  return {
    id: dbSong.id,
    name: dbSong.name,
    author: dbSong.author,
    performers: dbSong.performers,
    image: dbSong.image,
    lyric: dbSong.lyric,
    refUrls: dbSong.ref_urls,
    categories: dbSong.categories,
    tags: dbSong.tags,
    scores: dbSong.scores,
    lastSungAt: dbSong.last_sung_at,
    singCount: dbSong.sing_count,
    priority: dbSong.priority,
    last_update: dbSong.last_update,
    created_at: dbSong.created_at,
  };
}

// Convert frontend format (camelCase) to database format (snake_case)
export function mapFrontendToDatabase(frontendSong: Song): DatabaseSong {
  return {
    id: frontendSong.id,
    name: frontendSong.name,
    author: frontendSong.author,
    performers: frontendSong.performers,
    image: frontendSong.image,
    lyric: frontendSong.lyric,
    ref_urls: frontendSong.refUrls,
    categories: frontendSong.categories,
    tags: frontendSong.tags,
    scores: frontendSong.scores,
    last_sung_at: frontendSong.lastSungAt,
    sing_count: frontendSong.singCount,
    priority: frontendSong.priority,
    last_update: frontendSong.last_update,
    created_at: frontendSong.created_at,
  };
}

// Convert array of database songs to frontend format
export function mapDatabaseArrayToFrontend(dbSongs: any[]): Song[] {
  return dbSongs.map(song => {
    if (isDatabaseSong(song)) {
      return mapDatabaseToFrontend(song);
    }
    // Fallback: assume it's already in frontend format
    return song as Song;
  });
} 