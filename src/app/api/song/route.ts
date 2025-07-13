import { NextRequest, NextResponse } from 'next/server';
import { Song } from '@/types';
import { sql, initDatabase } from '@/utils/db';
import { mapDatabaseToFrontend, mapFrontendToDatabase, mapDatabaseArrayToFrontend, isDatabaseSong } from '@/utils/dataMapping';

// Khởi tạo database khi API được gọi lần đầu
let dbInitialized = false;

async function ensureDatabase() {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}

export async function GET() {
  try {
    await ensureDatabase();
    const dbSongs = await sql`SELECT * FROM songs ORDER BY priority DESC, last_update DESC`;
    const songs = mapDatabaseArrayToFrontend(dbSongs);
    return NextResponse.json(songs);
  } catch (error) {
    console.error('Error fetching songs:', error);
    return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDatabase();
    const songData: Partial<Song> = await req.json();
    
    const now = new Date().toISOString();
    const newSong: Song = {
      ...songData,
      id: songData.id || Date.now().toString(),
      last_update: now,
      created_at: now,
      performers: songData.performers || [],
      refUrls: songData.refUrls || [],
      categories: songData.categories || [],
      tags: songData.tags || [],
      scores: songData.scores || [],
      lastSungAt: songData.lastSungAt || null,
      singCount: songData.singCount || 0,
      priority: songData.priority || 0,
    } as Song;
    
    const dbSong = mapFrontendToDatabase(newSong);
    await sql`
      INSERT INTO songs (
        id, name, author, performers, image, lyric, ref_urls, 
        categories, tags, scores, last_sung_at, sing_count, 
        priority, last_update, created_at
      ) VALUES (
        ${dbSong.id}, ${dbSong.name}, ${dbSong.author}, 
        ${dbSong.performers}, ${dbSong.image}, ${dbSong.lyric}, 
        ${dbSong.ref_urls}, ${dbSong.categories}, ${dbSong.tags}, 
        ${dbSong.scores}, ${dbSong.last_sung_at}, ${dbSong.sing_count}, 
        ${dbSong.priority}, ${dbSong.last_update}, ${dbSong.created_at}
      )
    `;
    
    return NextResponse.json(newSong, { status: 201 });
  } catch (error) {
    console.error('Error creating song:', error);
    return NextResponse.json({ error: 'Failed to create song' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await ensureDatabase();
    const song: Song = await req.json();
    
    const dbSong = mapFrontendToDatabase(song);
    const result = await sql`
      UPDATE songs SET 
        name = ${dbSong.name},
        author = ${dbSong.author},
        performers = ${dbSong.performers},
        image = ${dbSong.image},
        lyric = ${dbSong.lyric},
        ref_urls = ${dbSong.ref_urls},
        categories = ${dbSong.categories},
        tags = ${dbSong.tags},
        scores = ${dbSong.scores},
        last_sung_at = ${dbSong.last_sung_at},
        sing_count = ${dbSong.sing_count},
        priority = ${dbSong.priority},
        last_update = ${new Date().toISOString()}
      WHERE id = ${dbSong.id}
      RETURNING *
    `;
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }
    
    const updatedSong = isDatabaseSong(result[0]) ? mapDatabaseToFrontend(result[0]) : result[0];
    return NextResponse.json(updatedSong);
  } catch (error) {
    console.error('Error updating song:', error);
    return NextResponse.json({ error: 'Failed to update song' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ensureDatabase();
    const { id } = await req.json();
    
    const result = await sql`
      DELETE FROM songs WHERE id = ${id} RETURNING *
    `;
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }
    
    const deletedSong = isDatabaseSong(result[0]) ? mapDatabaseToFrontend(result[0]) : result[0];
    return NextResponse.json(deletedSong);
  } catch (error) {
    console.error('Error deleting song:', error);
    return NextResponse.json({ error: 'Failed to delete song' }, { status: 500 });
  }
}

// API để rate bài hát (thêm điểm và cập nhật singCount, lastSungAt)
export async function PATCH(req: NextRequest) {
  try {
    await ensureDatabase();
    const { id, rating } = await req.json();
    
    if (!id || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid rating (must be 1-5)' }, { status: 400 });
    }
    
    const now = new Date().toISOString();
    
    const result = await sql`
      UPDATE songs SET 
        scores = array_append(scores, ${rating}),
        sing_count = sing_count + 1,
        last_sung_at = ${now},
        last_update = ${now}
      WHERE id = ${id}
      RETURNING *
    `;
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }
    
    const ratedSong = isDatabaseSong(result[0]) ? mapDatabaseToFrontend(result[0]) : result[0];
    return NextResponse.json(ratedSong);
  } catch (error) {
    console.error('Error rating song:', error);
    return NextResponse.json({ error: 'Failed to rate song' }, { status: 500 });
  }
}