const songs = [
  {
    id: '1',
    name: 'Sầu Tím Thiệp Hồng',
    author: 'Hoàng Thi Thơ',
    performers: ['Lệ Quyên', 'Quang Hà'],
    image: 'https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526',
    lyric: `Sầu tím thiệp hồng
Tôi gửi cho ai đó
Một tấm thiệp hồng
Với nỗi sầu tím

Tôi gửi cho ai đó
Một tấm thiệp hồng
Với nỗi sầu tím
Và lời yêu thương...`,
    refUrls: [
      'https://www.youtube.com/watch?v=example1',
      'https://open.spotify.com/track/example1',
    ],
    categories: ['Bolero', 'Nhạc Vàng'],
    tags: ['tình yêu', 'sầu', 'bolero', 'classic'],
    score: 9.5,
    lastSungAt: '2024-01-15T10:30:00Z',
    singCount: 25,
    priority: 95,
  },
  {
    id: '2',
    name: 'Tàu Anh Qua Núi',
    author: 'Phạm Duy',
    performers: ['Thái Thanh', 'Duy Khánh'],
    image: 'https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5527',
    lyric: `Tàu anh qua núi
Tàu em qua đồi
Tàu anh qua núi
Tàu em qua đồi

Tàu anh qua núi
Tàu em qua đồi
Tàu anh qua núi
Tàu em qua đồi...`,
    refUrls: [
      'https://www.youtube.com/watch?v=example2',
      'https://open.spotify.com/track/example2',
    ],
    categories: ['Nhạc Vàng', 'Dân Ca'],
    tags: ['tàu', 'núi', 'dân ca', 'classic'],
    score: 9.0,
    lastSungAt: '2024-01-10T15:45:00Z',
    singCount: 18,
    priority: 85,
  },
  {
    id: '3',
    name: 'Những Đồi Hoa Sim',
    author: 'Dzũng Chinh',
    performers: ['Hương Lan', 'Chế Linh'],
    image: 'https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5528',
    lyric: `Những đồi hoa sim
Ôi những đồi hoa sim tím
Chiều hoang biền biệt
Có ai về thôn xưa

Những đồi hoa sim
Ôi những đồi hoa sim tím
Chiều hoang biền biệt
Có ai về thôn xưa...`,
    refUrls: [
      'https://www.youtube.com/watch?v=example3',
      'https://open.spotify.com/track/example3',
    ],
    categories: ['Nhạc Vàng', 'Bolero'],
    tags: ['hoa sim', 'tình yêu', 'classic', 'bolero'],
    score: 9.2,
    lastSungAt: '2024-01-08T20:15:00Z',
    singCount: 22,
    priority: 90,
  },
  {
    id: '4',
    name: 'Đêm Đông',
    author: 'Nguyễn Văn Thương',
    performers: ['Khánh Ly', 'Trịnh Công Sơn'],
    image: 'https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5529',
    lyric: `Đêm đông xa trường
Lòng buồn lắm em ơi
Đêm đông xa trường
Lòng buồn lắm em ơi

Đêm đông xa trường
Lòng buồn lắm em ơi
Đêm đông xa trường
Lòng buồn lắm em ơi...`,
    refUrls: [
      'https://www.youtube.com/watch?v=example4',
      'https://open.spotify.com/track/example4',
    ],
    categories: ['Nhạc Vàng', 'Tình Khúc'],
    tags: ['đêm đông', 'tình yêu', 'classic', 'trịnh công sơn'],
    score: 8.8,
    lastSungAt: '2024-01-05T19:30:00Z',
    singCount: 15,
    priority: 80,
  },
  {
    id: '5',
    name: 'Cô Láng Giềng',
    author: 'Hoàng Thi Thơ',
    performers: ['Lệ Quyên', 'Quang Hà'],
    image: 'https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5530',
    lyric: `Cô láng giềng ơi
Cô có nhớ tôi không
Cô láng giềng ơi
Cô có nhớ tôi không

Cô láng giềng ơi
Cô có nhớ tôi không
Cô láng giềng ơi
Cô có nhớ tôi không...`,
    refUrls: [
      'https://www.youtube.com/watch?v=example5',
      'https://open.spotify.com/track/example5',
    ],
    categories: ['Bolero', 'Nhạc Vàng'],
    tags: ['láng giềng', 'tình yêu', 'bolero', 'classic'],
    score: 8.5,
    lastSungAt: '2024-01-12T14:20:00Z',
    singCount: 12,
    priority: 75,
  },
  {
    id: '6',
    name: 'Hòn Vọng Phu',
    author: 'Lê Thương',
    performers: ['Thái Thanh', 'Duy Khánh'],
    image: 'https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5531',
    lyric: `Hòn vọng phu
Tôi đứng trên đỉnh núi
Hòn vọng phu
Tôi đứng trên đỉnh núi

Hòn vọng phu
Tôi đứng trên đỉnh núi
Hòn vọng phu
Tôi đứng trên đỉnh núi...`,
    refUrls: [
      'https://www.youtube.com/watch?v=example6',
      'https://open.spotify.com/track/example6',
    ],
    categories: ['Nhạc Vàng', 'Dân Ca'],
    tags: ['hòn vọng phu', 'dân ca', 'classic', 'tình yêu'],
    score: 8.7,
    lastSungAt: '2024-01-03T16:45:00Z',
    singCount: 10,
    priority: 70,
  },
];

module.exports = songs;
