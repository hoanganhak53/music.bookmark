import { neon } from '@netlify/neon';
import { promises as fs } from 'fs';
import path from 'path';

const sql = neon();

async function migrateData() {
  try {
    // Đọc dữ liệu từ file JSON
    const dataPath = path.join(process.cwd(), 'data', 'songs.json');
    const jsonData = await fs.readFile(dataPath, 'utf-8');
    const songs = JSON.parse(jsonData);

    console.log(`Found ${songs.length} songs to migrate`);

    // Tạo bảng nếu chưa tồn tại
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

    // Xóa dữ liệu cũ (nếu có)
    await sql`DELETE FROM songs`;

    // Insert dữ liệu mới
    for (const song of songs) {
      await sql`
        INSERT INTO songs (
          id, name, author, performers, image, lyric, refUrls, 
          categories, tags, scores, lastSungAt, singCount, 
          priority, last_update, created_at
        ) VALUES (
          ${song.id}, ${song.name}, ${song.author}, 
          ${song.performers}, ${song.image}, ${song.lyric}, 
          ${song.refUrls}, ${song.categories}, ${song.tags}, 
          ${song.scores}, ${song.lastSungAt}, ${song.singCount}, 
          ${song.priority}, ${song.last_update}, ${song.created_at}
        )
      `;
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Chạy migration nếu file được execute trực tiếp
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateData();
} 