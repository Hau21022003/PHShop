"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronRight, Edit, Star } from "lucide-react";

const ProductTable = () => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const products = [
    {
      id: 1,
      name: "iPhone 14 Pro Max",
      category: "Smartphone",
      price: 29990000,
      stock: 364,
      sold: 123,
      rating: 4.6,
      reviews: 41,
      image:
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop",
      description:
        "iPhone 14 Pro Max với chip A16 Bionic mạnh mẽ, camera 48MP chuyên nghiệp và màn hình Super Retina XDR 6.7 inch.",
      specs: {
        screen: "6.7 inch Super Retina XDR",
        chip: "A16 Bionic",
        camera: "48MP + 12MP + 12MP",
        battery: "4323 mAh",
        storage: "128GB",
      },
    },
    {
      id: 2,
      name: "Samsung Galaxy S23 Ultra",
      category: "Smartphone",
      price: 31990000,
      stock: 156,
      sold: 89,
      rating: 4.8,
      reviews: 72,
      image:
        "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&h=100&fit=crop",
      description:
        "Samsung Galaxy S23 Ultra với bút S Pen tích hợp, camera 200MP và màn hình Dynamic AMOLED 2X 6.8 inch.",
      specs: {
        screen: "6.8 inch Dynamic AMOLED 2X",
        chip: "Snapdragon 8 Gen 2",
        camera: "200MP + 12MP + 10MP + 10MP",
        battery: "5000 mAh",
        storage: "256GB",
      },
    },
    {
      id: 3,
      name: "MacBook Air M2",
      category: "Laptop",
      price: 32990000,
      stock: 89,
      sold: 45,
      rating: 4.9,
      reviews: 28,
      image:
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=100&h=100&fit=crop",
      description:
        "MacBook Air với chip M2 mới nhất, thiết kế siêu mỏng nhẹ và thời lượng pin lên đến 18 giờ.",
      specs: {
        screen: "13.6 inch Liquid Retina",
        chip: "Apple M2",
        ram: "8GB",
        storage: "256GB SSD",
        weight: "1.24 kg",
      },
    },
  ];

  const toggleRow = (productId) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(productId)) {
      newExpandedRows.delete(productId);
    } else {
      newExpandedRows.add(productId);
    }
    setExpandedRows(newExpandedRows);
  };

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN");
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left py-4 px-4 font-medium text-gray-600 uppercase tracking-wide text-sm">
                Tên sản phẩm
              </th>
              <th className="text-left py-4 px-4 font-medium text-gray-600 uppercase tracking-wide text-sm">
                Giá
              </th>
              <th className="text-left py-4 px-4 font-medium text-gray-600 uppercase tracking-wide text-sm">
                Kho
              </th>
              <th className="text-left py-4 px-4 font-medium text-gray-600 uppercase tracking-wide text-sm">
                Đánh giá
              </th>
              <th className="text-left py-4 px-4 font-medium text-gray-600 uppercase tracking-wide text-sm">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <React.Fragment key={product.id}>
                {/* Main Row */}
                <tr className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-14 h-14 rounded-md object-cover"
                      />
                      <div className="max-w-80">
                        <p className="font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-gray-500 text-sm truncate">
                          {product.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-900 font-medium">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-gray-400">đ</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p>
                        <span className="text-gray-900 font-medium">
                          {product.stock} item
                        </span>{" "}
                        <span className="text-gray-400">Left</span>
                      </p>
                      <p className="text-gray-400 text-sm">
                        {product.sold} Sold
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-gray-900 font-medium">
                        {product.rating}
                      </span>
                      <span className="text-gray-400 text-sm">
                        ({product.reviews} reviews)
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleRow(product.id)}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        {expandedRows.has(product.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </td>
                </tr>

                {/* Expanded Detail Row */}
                {expandedRows.has(product.id) && (
                  <tr className="bg-gray-50">
                    <td colSpan="5" className="py-6 px-4">
                      <div className="max-w-4xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Product Image */}
                          <div className="space-y-4">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          </div>

                          {/* Product Description */}
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Mô tả sản phẩm
                              </h3>
                              <p className="text-gray-600 leading-relaxed">
                                {product.description}
                              </p>
                            </div>
                          </div>

                          {/* Product Specifications */}
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Thông số kỹ thuật
                              </h3>
                              <div className="space-y-2">
                                {Object.entries(product.specs).map(
                                  ([key, value]) => (
                                    <div
                                      key={key}
                                      className="flex justify-between py-1 border-b border-gray-200 last:border-0"
                                    >
                                      <span className="text-gray-500 capitalize">
                                        {key}:
                                      </span>
                                      <span className="text-gray-900 font-medium">
                                        {value}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex gap-3">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            Chỉnh sửa chi tiết
                          </button>
                          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                            Xem lịch sử bán hàng
                          </button>
                          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                            Quản lý kho
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
