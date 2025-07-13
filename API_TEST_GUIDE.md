# 🧪 Hướng dẫn Test API Locally

## 📋 Chuẩn bị

### 1. Khởi động server development

```bash
npm run dev
```

Server sẽ chạy tại `http://localhost:3000`

### 2. Kiểm tra API endpoints có sẵn

- `GET /api/song` - Lấy danh sách bài hát
- `POST /api/song` - Thêm bài hát mới
- `PUT /api/song` - Sửa bài hát
- `DELETE /api/song` - Xóa bài hát
- `PATCH /api/song` - Rate bài hát

## 🚀 Cách Test

### Cách 1: Sử dụng script test tự động

```bash
# Test đầy đủ tất cả API
npm run test:api

# Test đơn giản từng API
npm run test:simple
```

### Cách 2: Test thủ công với curl

#### 1. GET - Lấy danh sách bài hát

```bash
curl http://localhost:3000/api/song
```

#### 2. POST - Thêm bài hát mới

```bash
curl -X POST http://localhost:3000/api/song \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Song",
    "author": "Test Author",
    "performers": ["Test Performer"],
    "image": "https://via.placeholder.com/300x200",
    "lyric": "Test lyrics...",
    "refUrls": ["https://www.youtube.com/watch?v=test"],
    "categories": ["Test"],
    "tags": ["test"],
    "scores": [],
    "singCount": 0,
    "lastSungAt": null,
    "priority": 0
  }'
```

#### 3. PUT - Sửa bài hát

```bash
curl -X PUT http://localhost:3000/api/song \
  -H "Content-Type: application/json" \
  -d '{
    "id": "SONG_ID_HERE",
    "name": "Updated Test Song",
    "author": "Updated Author",
    "performers": ["Updated Performer"],
    "image": "https://via.placeholder.com/300x200",
    "lyric": "Updated lyrics...",
    "refUrls": ["https://www.youtube.com/watch?v=updated"],
    "categories": ["Updated"],
    "tags": ["updated"],
    "scores": [],
    "singCount": 0,
    "lastSungAt": null,
    "priority": 0,
    "last_update": "2024-01-01T00:00:00Z",
    "created_at": "2024-01-01T00:00:00Z"
  }'
```

#### 4. PATCH - Rate bài hát

```bash
curl -X PATCH http://localhost:3000/api/song \
  -H "Content-Type: application/json" \
  -d '{
    "id": "SONG_ID_HERE",
    "rating": 5
  }'
```

#### 5. DELETE - Xóa bài hát

```bash
curl -X DELETE http://localhost:3000/api/song \
  -H "Content-Type: application/json" \
  -d '{
    "id": "SONG_ID_HERE"
  }'
```

### Cách 3: Test với Postman/Insomnia

1. **GET Request**

   - Method: `GET`
   - URL: `http://localhost:3000/api/song`

2. **POST Request**

   - Method: `POST`
   - URL: `http://localhost:3000/api/song`
   - Headers: `Content-Type: application/json`
   - Body (JSON):

   ```json
   {
     "name": "Test Song",
     "author": "Test Author",
     "performers": ["Test Performer"],
     "image": "https://via.placeholder.com/300x200",
     "lyric": "Test lyrics...",
     "refUrls": ["https://www.youtube.com/watch?v=test"],
     "categories": ["Test"],
     "tags": ["test"],
     "scores": [],
     "singCount": 0,
     "lastSungAt": null,
     "priority": 0
   }
   ```

3. **PUT Request**

   - Method: `PUT`
   - URL: `http://localhost:3000/api/song`
   - Headers: `Content-Type: application/json`
   - Body: Tương tự POST nhưng thêm `id`

4. **PATCH Request**

   - Method: `PATCH`
   - URL: `http://localhost:3000/api/song`
   - Headers: `Content-Type: application/json`
   - Body:

   ```json
   {
     "id": "SONG_ID_HERE",
     "rating": 5
   }
   ```

5. **DELETE Request**
   - Method: `DELETE`
   - URL: `http://localhost:3000/api/song`
   - Headers: `Content-Type: application/json`
   - Body:
   ```json
   {
     "id": "SONG_ID_HERE"
   }
   ```

## 🧪 Test Cases

### Test Cases Cơ bản

1. ✅ **GET** - Lấy danh sách bài hát
2. ✅ **POST** - Thêm bài hát mới
3. ✅ **PUT** - Sửa bài hát
4. ✅ **PATCH** - Rate bài hát
5. ✅ **DELETE** - Xóa bài hát

### Test Cases Lỗi

1. ❌ **PATCH** - Rate với điểm > 5 (phải trả về 400)
2. ❌ **PUT** - Sửa bài hát không tồn tại (phải trả về 404)
3. ❌ **DELETE** - Xóa bài hát không tồn tại (phải trả về 404)
4. ❌ **POST** - Thêm bài hát thiếu tên (phải trả về lỗi)

## 📊 Kết quả mong đợi

### Thành công

- **GET**: Trả về array các bài hát
- **POST**: Trả về bài hát đã tạo với status 201
- **PUT**: Trả về bài hát đã cập nhật
- **PATCH**: Trả về bài hát với scores được cập nhật
- **DELETE**: Trả về bài hát đã xóa

### Lỗi

- **400**: Dữ liệu không hợp lệ
- **404**: Không tìm thấy bài hát
- **500**: Lỗi server

## 🔧 Troubleshooting

### Lỗi thường gặp

1. **"fetch is not defined"**

   - Cài đặt node-fetch: `npm install node-fetch`
   - Hoặc sử dụng curl/Postman

2. **"Connection refused"**

   - Kiểm tra server đã chạy chưa: `npm run dev`
   - Kiểm tra port 3000 có bị chiếm không

3. **"Cannot read property 'length' of undefined"**

   - Kiểm tra response có đúng format JSON không
   - Kiểm tra API có trả về array không

4. **Database errors**
   - Kiểm tra file `data/songs.json` có tồn tại không
   - Kiểm tra quyền đọc/ghi file

## 🎯 Tips

1. **Test theo thứ tự**: GET → POST → PUT → PATCH → DELETE
2. **Lưu ID**: Sau khi POST, lưu lại ID để test các API khác
3. **Kiểm tra response**: Luôn kiểm tra status code và response body
4. **Clean up**: Sau khi test xong, có thể xóa dữ liệu test

## 📝 Logs

Khi chạy test script, bạn sẽ thấy logs như:

```
🚀 Starting API tests...

1️⃣ Testing GET /api/song
✅ Status: 200
📊 Found 3 songs

2️⃣ Testing POST /api/song
✅ Status: 201
📝 Created song: Test Song - 1703123456789 (ID: 1703123456789)

3️⃣ Testing PUT /api/song
✅ Status: 200
📝 Updated song: Updated Test Song

4️⃣ Testing PATCH /api/song (Rate)
✅ Status: 200
⭐ Rated song: Updated Test Song (Score: 1 ratings)

5️⃣ Testing DELETE /api/song
✅ Status: 200
🗑️ Deleted song: Updated Test Song

🎉 All tests completed!
```
