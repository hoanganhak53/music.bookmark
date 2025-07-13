// YouTube URL parser và metadata extractor
export interface YouTubeInfo {
  title: string;
  author?: string;
  description?: string;
  thumbnail?: string;
  duration?: string;
  viewCount?: string;
  publishedAt?: string;
  lyrics?: string;
}

// Parse YouTube URL để lấy video ID
export function parseYouTubeUrl(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

// Validate YouTube URL
export function isValidYouTubeUrl(url: string): boolean {
  return parseYouTubeUrl(url) !== null;
}

// Extract basic info from YouTube URL (client-side only)
export function extractYouTubeInfo(url: string): Promise<YouTubeInfo> {
  return new Promise((resolve, reject) => {
    const videoId = parseYouTubeUrl(url);
    if (!videoId) {
      reject(new Error('Invalid YouTube URL'));
      return;
    }

    // Sử dụng YouTube oEmbed API để lấy thông tin cơ bản
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    
    fetch(oembedUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch YouTube info');
        }
        return response.json();
      })
      .then(data => {
        const info: YouTubeInfo = {
          title: data.title || 'Unknown Title',
          author: data.author_name || 'Unknown Author',
          thumbnail: data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          description: data.description || ''
        };
        resolve(info);
      })
      .catch(error => {
        // Fallback: tạo info cơ bản từ video ID
        const fallbackInfo: YouTubeInfo = {
          title: `YouTube Video (${videoId})`,
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        };
        resolve(fallbackInfo);
      });
  });
}

// Clean YouTube title để tạo tên bài hát (giữ nguyên tên, chỉ loại bỏ các tag không cần thiết)
export function cleanYouTubeTitle(title: string): string {
  // Loại bỏ các pattern phổ biến trong YouTube titles nhưng giữ nguyên tên bài hát
  const patterns = [
    /\[.*?\]/g, // [Official Video], [Lyrics], etc.
    /\(.*?\)/g, // (Official), (Lyrics), etc.
    /【.*?】/g, // 【Official Video】
    /「.*?」/g, // 「Official Video」
    /official.*video/gi, // Official Video
    /lyrics.*video/gi, // Lyrics Video
    /music.*video/gi, // Music Video
    /mv/gi, // MV
    /audio/gi, // Audio
    /live/gi, // Live
    /cover/gi, // Cover
    /remix/gi, // Remix
    /version/gi, // Version
  ];

  let cleanedTitle = title;
  patterns.forEach(pattern => {
    cleanedTitle = cleanedTitle.replace(pattern, '');
  });

  // Clean up extra spaces and trim
  cleanedTitle = cleanedTitle.replace(/\s+/g, ' ').trim();
  
  return cleanedTitle;
}

// Extract artist and song name from YouTube title
export function parseSongInfo(title: string): { artist: string; songName: string } {
  const cleanedTitle = cleanYouTubeTitle(title);
  
  // Clean artist name by removing common unwanted words
  function cleanArtistName(artistName: string): string {
    const unwantedWords = [
      // Tiếng Việt
      'tone', 'Tone', 'TONE', 'nữ', 'Nữ', 'NỮ', 'nam', 'Nam', 'NAM',
      'beat chuẩn', 'Beat Chuẩn', 'BEAT CHUẨN', 'beat', 'Beat', 'BEAT', 'chuẩn', 'Chuẩn', 'CHUẨN',
      'karaoke', 'Karaoke', 'KARAOKE', 'kara', 'Kara', 'KARA',
      'giọng nữ', 'Giọng Nữ', 'GIỌNG NỮ', 'giọng nam', 'Giọng Nam', 'GIỌNG NAM',
      'giọng', 'Giọng', 'GIỌNG',
      
      // Tiếng Anh
      'cover', 'Cover', 'COVER', 'remix', 'Remix', 'REMIX', 'version', 'Version', 'VERSION',
      'official', 'Official', 'OFFICIAL', 'lyrics', 'Lyrics', 'LYRICS', 
      'music', 'Music', 'MUSIC', 'video', 'Video', 'VIDEO', 'mv', 'Mv', 'MV',
      'audio', 'Audio', 'AUDIO', 'live', 'Live', 'LIVE', 
      'acoustic', 'Acoustic', 'ACOUSTIC', 'instrumental', 'Instrumental', 'INSTRUMENTAL',
      'original', 'Original', 'ORIGINAL', 'studio', 'Studio', 'STUDIO', 
      'recording', 'Recording', 'RECORDING', 'mix', 'Mix', 'MIX',
      'feat', 'Feat', 'FEAT', 'ft', 'Ft', 'FT', 'featuring', 'Featuring', 'FEATURING',
      'prod', 'Prod', 'PROD', 'produced by', 'Produced By', 'PRODUCED BY'
    ];
    
    let cleaned = artistName;
    
    // Remove unwanted words (case insensitive)
    unwantedWords.forEach(word => {
      const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      cleaned = cleaned.replace(regex, '');
    });
    
    // Clean up extra spaces and trim
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    // Additional cleanup: remove any remaining single letters or very short words
    cleaned = cleaned.split(' ').filter(word => word.length > 1).join(' ');
    
    // Capitalize first letter of each word
    cleaned = cleaned.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
    
    return cleaned;
  }
  
  // Common patterns for song name - artist
  const patterns = [
    /^(.+?)\s*[-–—]\s*(.+)$/, // Song Name - Artist
    /^(.+?)\s*:\s*(.+)$/, // Song Name: Artist
    /^(.+?)\s*\|\s*(.+)$/, // Song Name | Artist
    /^(.+?)\s*"(.+?)"$/, // Song Name "Artist"
    /^(.+?)\s*'(.+?)'$/, // Song Name 'Artist'
  ];

  for (const pattern of patterns) {
    const match = cleanedTitle.match(pattern);
    if (match) {
      const songName = match[1].trim();
      const rawArtist = match[2].trim();
      const artist = cleanArtistName(rawArtist);
      
      // Only return artist if it's not empty after cleaning
      if (artist && artist.length > 0) {
        return {
          artist: artist,
          songName: songName
        };
      }
    }
  }

  // Fallback: return as song name only
  return {
    artist: '',
    songName: cleanedTitle
  };
}

// Extract lyrics from YouTube description
export function extractLyricsFromDescription(description: string): string {
  if (!description) return '';

  // Các pattern để tìm lyrics trong description
  const lyricsPatterns = [
    // Tìm lyrics trong các block được đánh dấu
    /(?:lyrics?|lời bài hát|lời ca|Lyrics):\s*\n([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i,
    /(?:lyrics?|lời bài hát|lời ca|Lyrics)\s*[-:]\s*\n([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i,
    
    // Tìm lyrics trong dấu ngoặc kép hoặc ngoặc đơn
    /["'""]([^"']*lyrics?[^"']*)["'""]/i,
    /\(([^)]*lyrics?[^)]*)\)/i,
    
    // Tìm block text có vẻ là lyrics (nhiều dòng, có cấu trúc)
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s*\n[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s*\n[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
    
    // Tìm text có chứa từ "lyrics" và có cấu trúc verse/chorus
    /(?:verse|chorus|verse 1|chorus 1|verse 2|chorus 2)[:\s]*\n([\s\S]*?)(?=\n(?:verse|chorus|verse \d+|chorus \d+)|$)/i,
  ];

  for (const pattern of lyricsPatterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      let lyrics = match[1].trim();
      
      // Clean up lyrics
      lyrics = lyrics
        .replace(/\n{3,}/g, '\n\n') // Giảm multiple line breaks
        .replace(/^\s+|\s+$/gm, '') // Trim whitespace từ mỗi dòng
        .replace(/[^\w\s\n.,!?;:'"()-]/g, '') // Loại bỏ ký tự đặc biệt không cần thiết
        .trim();
      
      if (lyrics.length > 20) { // Chỉ trả về nếu có đủ nội dung
        return lyrics;
      }
    }
  }

  // Fallback: tìm bất kỳ đoạn text nào có vẻ là lyrics (nhiều dòng, có cấu trúc)
  const lines = description.split('\n');
  const potentialLyrics: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.length > 10 && line.length < 100 && 
        /^[A-Za-z\s.,!?;:'"()-]+$/.test(line) && // Chỉ chứa text thông thường
        !line.includes('http') && // Không chứa link
        !line.includes('@') && // Không chứa mention
        !line.includes('#') && // Không chứa hashtag
        !line.match(/^\d+$/) && // Không phải số
        !line.match(/^[A-Z\s]+$/) && // Không phải toàn chữ hoa
        line.split(' ').length > 2) { // Có ít nhất 3 từ
      
      potentialLyrics.push(line);
    }
  }
  
  if (potentialLyrics.length >= 3) { // Cần ít nhất 3 dòng để coi là lyrics
    return potentialLyrics.join('\n');
  }

  return '';
} 