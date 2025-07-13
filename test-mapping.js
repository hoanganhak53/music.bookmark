// Test script cho data mapping
import {
  mapDatabaseToFrontend,
  mapFrontendToDatabase,
  mapDatabaseArrayToFrontend,
  isDatabaseSong,
} from './src/utils/dataMapping.js';

// Test data từ database (snake_case)
const dbSong = {
  id: '1',
  name: 'Test Song',
  author: 'Test Author',
  performers: ['Test Performer'],
  image: 'https://example.com/image.jpg',
  lyric: 'Test lyrics...',
  ref_urls: ['https://youtube.com/test'],
  categories: ['Test'],
  tags: ['test'],
  scores: [5, 4, 5],
  last_sung_at: '2024-01-01T00:00:00Z',
  sing_count: 3,
  priority: 10,
  last_update: '2024-01-01T00:00:00Z',
  created_at: '2024-01-01T00:00:00Z',
};

// Test data từ frontend (camelCase)
const frontendSong = {
  id: '1',
  name: 'Test Song',
  author: 'Test Author',
  performers: ['Test Performer'],
  image: 'https://example.com/image.jpg',
  lyric: 'Test lyrics...',
  refUrls: ['https://youtube.com/test'],
  categories: ['Test'],
  tags: ['test'],
  scores: [5, 4, 5],
  lastSungAt: '2024-01-01T00:00:00Z',
  singCount: 3,
  priority: 10,
  last_update: '2024-01-01T00:00:00Z',
  created_at: '2024-01-01T00:00:00Z',
};

console.log('🧪 Testing Data Mapping Functions');
console.log('='.repeat(50));

// Test 1: Database to Frontend
console.log('\n1️⃣ Testing mapDatabaseToFrontend:');
const convertedToFrontend = mapDatabaseToFrontend(dbSong);
console.log('✅ Database → Frontend:');
console.log('  - ref_urls → refUrls:', convertedToFrontend.refUrls);
console.log('  - last_sung_at → lastSungAt:', convertedToFrontend.lastSungAt);
console.log('  - sing_count → singCount:', convertedToFrontend.singCount);

// Test 2: Frontend to Database
console.log('\n2️⃣ Testing mapFrontendToDatabase:');
const convertedToDatabase = mapFrontendToDatabase(frontendSong);
console.log('✅ Frontend → Database:');
console.log('  - refUrls → ref_urls:', convertedToDatabase.ref_urls);
console.log('  - lastSungAt → last_sung_at:', convertedToDatabase.last_sung_at);
console.log('  - singCount → sing_count:', convertedToDatabase.sing_count);

// Test 3: Array mapping
console.log('\n3️⃣ Testing mapDatabaseArrayToFrontend:');
const dbSongs = [dbSong, dbSong];
const frontendSongs = mapDatabaseArrayToFrontend(dbSongs);
console.log('✅ Array mapping:', frontendSongs.length, 'songs converted');

// Test 4: Type guard
console.log('\n4️⃣ Testing isDatabaseSong:');
console.log('✅ Database song:', isDatabaseSong(dbSong));
console.log('❌ Frontend song:', isDatabaseSong(frontendSong));

console.log('\n🎉 All mapping tests completed!');
