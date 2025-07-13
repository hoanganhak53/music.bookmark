// Local Storage Keys
const BOOKMARKED_SONGS_KEY = 'music_bookmark_bookmarked_songs';
const CACHED_CATEGORIES_KEY = 'music_bookmark_cached_categories';
const CACHED_TAGS_KEY = 'music_bookmark_cached_tags';

// Bookmark functions
export function getBookmarkedSongs(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(BOOKMARKED_SONGS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading bookmarked songs:', error);
    return [];
  }
}

export function addBookmark(songId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const bookmarked = getBookmarkedSongs();
    if (!bookmarked.includes(songId)) {
      bookmarked.push(songId);
      localStorage.setItem(BOOKMARKED_SONGS_KEY, JSON.stringify(bookmarked));
    }
  } catch (error) {
    console.error('Error adding bookmark:', error);
  }
}

export function removeBookmark(songId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const bookmarked = getBookmarkedSongs();
    const filtered = bookmarked.filter(id => id !== songId);
    localStorage.setItem(BOOKMARKED_SONGS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing bookmark:', error);
  }
}

export function isBookmarked(songId: string): boolean {
  if (typeof window === 'undefined') return false;
  const bookmarked = getBookmarkedSongs();
  return bookmarked.includes(songId);
}

// Cache functions for categories and tags
export function getCachedCategories(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CACHED_CATEGORIES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading cached categories:', error);
    return [];
  }
}

export function addCachedCategory(category: string): void {
  if (typeof window === 'undefined') return;
  try {
    const cached = getCachedCategories();
    if (!cached.includes(category)) {
      cached.push(category);
      localStorage.setItem(CACHED_CATEGORIES_KEY, JSON.stringify(cached));
    }
  } catch (error) {
    console.error('Error adding cached category:', error);
  }
}

export function getCachedTags(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CACHED_TAGS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading cached tags:', error);
    return [];
  }
}

export function addCachedTag(tag: string): void {
  if (typeof window === 'undefined') return;
  try {
    const cached = getCachedTags();
    if (!cached.includes(tag)) {
      cached.push(tag);
      localStorage.setItem(CACHED_TAGS_KEY, JSON.stringify(cached));
    }
  } catch (error) {
    console.error('Error adding cached tag:', error);
  }
}

// Clear all cached data
export function clearAllCache(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(BOOKMARKED_SONGS_KEY);
    localStorage.removeItem(CACHED_CATEGORIES_KEY);
    localStorage.removeItem(CACHED_TAGS_KEY);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
} 