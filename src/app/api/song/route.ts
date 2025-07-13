import { NextRequest, NextResponse } from 'next/server';
import { Song } from '@/types';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'songs.json');

async function readSongs(): Promise<Song[]> {
  const data = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(data);
}

async function writeSongs(songs: Song[]): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(songs, null, 2), 'utf-8');
}

export async function GET() {
  const songs = await readSongs();
  return NextResponse.json(songs);
}

export async function POST(req: NextRequest) {
  const songData: Partial<Song> = await req.json();
  const songs = await readSongs();
  
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
  
  songs.unshift(newSong); // Thêm vào đầu danh sách
  await writeSongs(songs);
  return NextResponse.json(newSong, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const song: Song = await req.json();
  const songs = await readSongs();
  const idx = songs.findIndex((s) => s.id === song.id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Song not found' }, { status: 404 });
  }
  songs[idx] = song;
  await writeSongs(songs);
  return NextResponse.json(song);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const songs = await readSongs();
  const idx = songs.findIndex((s) => s.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Song not found' }, { status: 404 });
  }
  const deleted = songs.splice(idx, 1)[0];
  await writeSongs(songs);
  return NextResponse.json(deleted);
}

// API để rate bài hát (thêm điểm và cập nhật singCount, lastSungAt)
export async function PATCH(req: NextRequest) {
  const { id, rating } = await req.json();
  
  if (!id || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Invalid rating (must be 1-5)' }, { status: 400 });
  }
  
  const songs = await readSongs();
  const idx = songs.findIndex((s) => s.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Song not found' }, { status: 404 });
  }
  
  const song = songs[idx];
  const now = new Date().toISOString();
  
  // Cập nhật song
  if (!song.scores) song.scores = [];
  song.scores.push(rating);
  song.singCount += 1;
  song.lastSungAt = now;
  song.last_update = now;
  
  await writeSongs(songs);
  return NextResponse.json(song);
}