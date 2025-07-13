import { NextRequest, NextResponse } from 'next/server';
import { Song } from '@/types';
import { sql, initDatabase } from '@/utils/db';

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
    const songs = await sql`SELECT * FROM songs ORDER BY priority DESC, last_update DESC`;
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
    
    await sql`
      INSERT INTO songs (
        id, name, author, performers, image, lyric, refUrls, 
        categories, tags, scores, lastSungAt, singCount, 
        priority, last_update, created_at
      ) VALUES (
        ${newSong.id}, ${newSong.name}, ${newSong.author}, 
        ${newSong.performers}, ${newSong.image}, ${newSong.lyric}, 
        ${newSong.refUrls}, ${newSong.categories}, ${newSong.tags}, 
        ${newSong.scores}, ${newSong.lastSungAt}, ${newSong.singCount}, 
        ${newSong.priority}, ${newSong.last_update}, ${newSong.created_at}
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
    
    const result = await sql`
      UPDATE songs SET 
        name = ${song.name},
        author = ${song.author},
        performers = ${song.performers},
        image = ${song.image},
        lyric = ${song.lyric},
        refUrls = ${song.refUrls},
        categories = ${song.categories},
        tags = ${song.tags},
        scores = ${song.scores},
        lastSungAt = ${song.lastSungAt},
        singCount = ${song.singCount},
        priority = ${song.priority},
        last_update = ${new Date().toISOString()}
      WHERE id = ${song.id}
      RETURNING *
    `;
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }
    
    return NextResponse.json(result[0]);
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
    
    return NextResponse.json(result[0]);
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
        singCount = singCount + 1,
        lastSungAt = ${now},
        last_update = ${now}
      WHERE id = ${id}
      RETURNING *
    `;
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error rating song:', error);
    return NextResponse.json({ error: 'Failed to rate song' }, { status: 500 });
  }
}