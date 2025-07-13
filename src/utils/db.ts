import { neon } from '@netlify/neon';

// Tự động sử dụng biến môi trường NETLIFY_DATABASE_URL
export const sql = neon();

// Fallback data cho local development
const fallbackSongs = [
  {
    id: "1",
    name: "Sầu Tím Thiệp Hồng",
    author: "Hoàng Thi Thơ",
    performers: ["Lệ Quyên", "Quang Hà"],
    image: "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526",
    lyric: "Sầu tím thiệp hồng\nTôi gửi cho ai đó\nMột tấm thiệp hồng\nVới nỗi sầu tím...",
    ref_urls: ["https://www.youtube.com/watch?v=example1"],
    categories: ["Bolero", "Nhạc Vàng"],
    tags: ["Tình Yêu", "Sầu", "Classic"],
    scores: [5, 4, 5, 4, 5],
    last_sung_at: "2024-01-01T00:00:00Z",
    sing_count: 5,
    priority: 95,
    last_update: "2024-01-01T00:00:00Z",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "2", 
    name: "Tàu Anh Qua Núi",
    author: "Phạm Duy",
    performers: ["Thái Thanh", "Duy Khánh"],
    image: "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5527",
    lyric: "Tàu anh qua núi\nTàu em qua đồi...",
    ref_urls: ["https://www.youtube.com/watch?v=example2"],
    categories: ["Nhạc Vàng", "Dân Ca"],
    tags: ["Núi", "Dân Ca", "Classic"],
    scores: [4, 5, 4, 5, 4],
    last_sung_at: "2024-01-02T00:00:00Z",
    sing_count: 5,
    priority: 85,
    last_update: "2024-01-02T00:00:00Z",
    created_at: "2024-01-01T00:00:00Z"
  }
];

// In-memory storage cho local development
let localSongs = [...fallbackSongs];

// Helper function để tạo bảng songs nếu chưa tồn tại
export async function initDatabase() {
  try {
    // Chỉ chạy nếu có NETLIFY_DATABASE_URL
    if (process.env.NETLIFY_DATABASE_URL) {
      await sql`
        CREATE TABLE IF NOT EXISTS songs (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(500) NOT NULL,
          author VARCHAR(255),
          performers TEXT[],
          image TEXT,
          lyric TEXT,
          ref_urls TEXT[],
          categories TEXT[],
          tags TEXT[],
          scores INTEGER[],
          last_sung_at TIMESTAMP,
          sing_count INTEGER DEFAULT 0,
          priority INTEGER DEFAULT 0,
          last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log('Database initialized successfully');
    } else {
      console.log('Using local fallback data (no NETLIFY_DATABASE_URL found)');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Wrapper functions để handle cả local và production
export async function querySongs() {
  try {
    if (process.env.NETLIFY_DATABASE_URL) {
      return await sql`SELECT * FROM songs ORDER BY priority DESC, last_update DESC`;
    } else {
      // Return local data
      return localSongs;
    }
  } catch (error) {
    console.error('Database query failed, using local data:', error);
    return localSongs;
  }
}

export async function insertSong(songData: any) {
  try {
    if (process.env.NETLIFY_DATABASE_URL) {
      return await sql`
        INSERT INTO songs (
          id, name, author, performers, image, lyric, ref_urls, 
          categories, tags, scores, last_sung_at, sing_count, 
          priority, last_update, created_at
        ) VALUES (
          ${songData.id}, ${songData.name}, ${songData.author}, 
          ${songData.performers}, ${songData.image}, ${songData.lyric}, 
          ${songData.ref_urls}, ${songData.categories}, ${songData.tags}, 
          ${songData.scores}, ${songData.last_sung_at}, ${songData.sing_count}, 
          ${songData.priority}, ${songData.last_update}, ${songData.created_at}
        ) RETURNING *
      `;
    } else {
      // Add to local storage
      localSongs.unshift(songData);
      return [songData];
    }
  } catch (error) {
    console.error('Insert failed:', error);
    throw error;
  }
}

export async function updateSong(songData: any) {
  try {
    if (process.env.NETLIFY_DATABASE_URL) {
      return await sql`
        UPDATE songs SET 
          name = ${songData.name},
          author = ${songData.author},
          performers = ${songData.performers},
          image = ${songData.image},
          lyric = ${songData.lyric},
          ref_urls = ${songData.ref_urls},
          categories = ${songData.categories},
          tags = ${songData.tags},
          scores = ${songData.scores},
          last_sung_at = ${songData.last_sung_at},
          sing_count = ${songData.sing_count},
          priority = ${songData.priority},
          last_update = ${new Date().toISOString()}
        WHERE id = ${songData.id}
        RETURNING *
      `;
    } else {
      // Update local storage
      const index = localSongs.findIndex(s => s.id === songData.id);
      if (index !== -1) {
        localSongs[index] = { ...localSongs[index], ...songData };
        return [localSongs[index]];
      }
      return [];
    }
  } catch (error) {
    console.error('Update failed:', error);
    throw error;
  }
}

export async function deleteSong(id: string) {
  try {
    if (process.env.NETLIFY_DATABASE_URL) {
      return await sql`
        DELETE FROM songs WHERE id = ${id} RETURNING *
      `;
    } else {
      // Remove from local storage
      const index = localSongs.findIndex(s => s.id === id);
      if (index !== -1) {
        const deleted = localSongs.splice(index, 1)[0];
        return [deleted];
      }
      return [];
    }
  } catch (error) {
    console.error('Delete failed:', error);
    throw error;
  }
}

export async function rateSong(id: string, rating: number) {
  try {
    if (process.env.NETLIFY_DATABASE_URL) {
      const now = new Date().toISOString();
      return await sql`
        UPDATE songs SET 
          scores = array_append(scores, ${rating}),
          sing_count = sing_count + 1,
          last_sung_at = ${now},
          last_update = ${now}
        WHERE id = ${id}
        RETURNING *
      `;
    } else {
      // Update local storage
      const index = localSongs.findIndex(s => s.id === id);
      if (index !== -1) {
        const now = new Date().toISOString();
        localSongs[index] = {
          ...localSongs[index],
          scores: [...(localSongs[index].scores || []), rating],
          sing_count: (localSongs[index].sing_count || 0) + 1,
          last_sung_at: now,
          last_update: now
        };
        return [localSongs[index]];
      }
      return [];
    }
  } catch (error) {
    console.error('Rate failed:', error);
    throw error;
  }
}