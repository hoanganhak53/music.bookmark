import React from "react";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import { HelpCircle, X } from "lucide-react";

interface GuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GuideModal({ open, onOpenChange }: GuideModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && <div className="fixed inset-0 z-40 bg-black/70 transition-opacity" aria-hidden="true"></div>}
      <DialogContent className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="relative w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 sm:p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                <h2 className="text-lg sm:text-2xl font-bold">Hướng dẫn sử dụng Music Bookmark</h2>
              </div>
              <button 
                onClick={() => onOpenChange(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-100px)] sm:max-h-[calc(90vh-120px)]">
            <div className="space-y-6">
              {/* Giới thiệu */}
              <section>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Giới thiệu
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Music Bookmark là ứng dụng quản lý bài hát karaoke cá nhân, giúp bạn lưu trữ, tìm kiếm và theo dõi 
                  các bài hát yêu thích một cách hiệu quả. Ứng dụng hỗ trợ đầy đủ các tính năng từ thêm bài hát, 
                  đánh giá, bookmark đến thống kê chi tiết.
                </p>
              </section>

              {/* Tính năng chính */}
              <section>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Tính năng chính
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-blue-800 mb-2">📝 Quản lý bài hát</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Thêm bài hát mới với thông tin đầy đủ</li>
                      <li>• Chỉnh sửa thông tin bài hát</li>
                      <li>• Xóa bài hát không cần thiết</li>
                      <li>• Lưu trữ lời bài hát</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-purple-800 mb-2">🔍 Tìm kiếm & Lọc</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Tìm kiếm theo tên, tác giả, người trình bày</li>
                      <li>• Lọc theo tag và thể loại</li>
                      <li>• Sắp xếp theo nhiều tiêu chí</li>
                      <li>• Chế độ xem tất cả hoặc chỉ bookmark</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-yellow-800 mb-2">⭐ Đánh giá & Theo dõi</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Đánh giá bài hát từ 1-5 sao</li>
                      <li>• Theo dõi số lần hát</li>
                      <li>• Ghi nhận lần hát gần nhất</li>
                      <li>• Thống kê điểm trung bình</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-green-800 mb-2">🔖 Bookmark & Lưu trữ</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Bookmark bài hát yêu thích</li>
                      <li>• Lưu trữ local không mất dữ liệu</li>
                      <li>• Xem chi tiết bài hát</li>
                      <li>• Quản lý link tham khảo</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Hướng dẫn sử dụng */}
              <section>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Hướng dẫn sử dụng
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="border-l-4 border-blue-500 pl-3 sm:pl-4">
                    <h4 className="font-semibold text-gray-800 mb-1">Thêm bài hát mới</h4>
                    <p className="text-sm text-gray-600">Nhấn nút "Thêm bài hát" và điền đầy đủ thông tin. Bạn có thể thêm lời bài hát, link ảnh, và chọn tags/thể loại phù hợp.</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-3 sm:pl-4">
                    <h4 className="font-semibold text-gray-800 mb-1">Tìm kiếm và lọc</h4>
                    <p className="text-sm text-gray-600">Sử dụng thanh tìm kiếm để tìm bài hát theo tên, tác giả. Dùng dropdown để lọc theo tag hoặc thể loại.</p>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-3 sm:pl-4">
                    <h4 className="font-semibold text-gray-800 mb-1">Đánh giá và bookmark</h4>
                    <p className="text-sm text-gray-600">Sau khi hát, nhấn nút "Hát" để đánh giá bài hát. Sử dụng nút "Bookmark" để lưu bài hát yêu thích.</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-3 sm:pl-4">
                    <h4 className="font-semibold text-gray-800 mb-1">Xem chi tiết</h4>
                    <p className="text-sm text-gray-600">Nhấn vào tên bài hát để xem thông tin chi tiết, lời bài hát và các link tham khảo.</p>
                  </div>
                </div>
              </section>

              {/* Lưu ý */}
              <section>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Lưu ý quan trọng
                </h3>
                <div className="bg-orange-50 p-4 rounded-xl">
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Dữ liệu được lưu trữ local trên trình duyệt của bạn</li>
                    <li>• Xóa cache trình duyệt có thể làm mất dữ liệu</li>
                    <li>• Nên sao lưu dữ liệu định kỳ</li>
                    <li>• Ứng dụng hoạt động offline sau khi load lần đầu</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 