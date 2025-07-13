import { neon } from '@netlify/neon';

// Tự động sử dụng biến môi trường NETLIFY_DATABASE_URL
export const sql = neon();

// Helper function để tạo bảng songs nếu chưa tồn tại
export async function initDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS songs (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(500) NOT NULL,
        author VARCHAR(255),
        performers TEXT[],
        image TEXT,
        lyric TEXT,
        refUrls TEXT[],
        categories TEXT[],
        tags TEXT[],
        scores INTEGER[],
        lastSungAt TIMESTAMP,
        singCount INTEGER DEFAULT 0,
        priority INTEGER DEFAULT 0,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
} 