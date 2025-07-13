import { NextRequest, NextResponse } from 'next/server';
import { Song } from '@/types';
import { initDatabase, querySongs, insertSong, updateSong, deleteSong, rateSong } from '@/utils/db';

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
    const songs = await querySongs();
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
      ref_urls: songData.ref_urls || [],
      categories: songData.categories || [],
      tags: songData.tags || [],
      scores: songData.scores || [],
      last_sung_at: songData.last_sung_at || null,
      sing_count: songData.sing_count || 0,
      priority: songData.priority || 0,
    } as Song;
    
    const result = await insertSong(newSong);
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating song:', error);
    return NextResponse.json({ error: 'Failed to create song' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await ensureDatabase();
    const song: Song = await req.json();
    
    const result = await updateSong(song);
    
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
    
    const result = await deleteSong(id);
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error deleting song:', error);
    return NextResponse.json({ error: 'Failed to delete song' }, { status: 500 });
  }
}

// API để rate bài hát (thêm điểm và cập nhật sing_count, last_sung_at)
export async function PATCH(req: NextRequest) {
  try {
    await ensureDatabase();
    const { id, rating } = await req.json();
    
    if (!id || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid rating (must be 1-5)' }, { status: 400 });
    }
    
    const result = await rateSong(id, rating);
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error rating song:', error);
    return NextResponse.json({ error: 'Failed to rate song' }, { status: 500 });
  }
}