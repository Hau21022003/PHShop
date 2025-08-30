/* eslint-disable @next/next/no-img-element */
import { Review } from "@/types/review.type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { User } from "lucide-react";
import { formatDateWithRelative } from "@/utils/time";
import { showImage } from "@/components/image-viewer";
import TextCollapse from "@/components/text-collapse";

export default function ReviewItem({ review }: { review: Review }) {
  return (
    <div key={review._id} className="space-y-3">
      {/* Top item */}
      <div className="flex items-start gap-3">
        <div className="rounded-full w-12 h-12 overflow-hidden">
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <User className="w-7 h-7 text-gray-600" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <p className="font-medium text-sm">
              {review.userSnapshot.fullName}
            </p>
            <p className="text-gray-400 text-sm">
              {formatDateWithRelative(review.createdAt)}
            </p>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: review.rating }).map((_, idx) => (
              <FontAwesomeIcon
                key={idx}
                icon={faStar}
                className="w-5 h-5 text-orange-500"
              />
            ))}
            {Array.from({ length: 5 - review.rating }).map((_, idx) => (
              <FontAwesomeIcon
                key={idx}
                icon={faStar}
                className="w-5 h-5 text-gray-300"
              />
            ))}
          </div>
        </div>
      </div>
      {/* Description */}
      <div className="pl-15 space-y-4">
        <TextCollapse text={review.content} />
        {review.images.length !== 0 && (
          <div className="flex flex-wrap gap-4">
            {review.images.map((itemUrl, idx) => (
              <img
                onClick={() => showImage(itemUrl)}
                key={idx}
                src={itemUrl}
                alt=""
                className="w-24 h-24 object-cover cursor-pointer"
              />
            ))}
          </div>
        )}
        {review.shopReply && (
          <div className="py-2 px-4 bg-gray-200">
            <TextCollapse text={review.shopReply} />
          </div>
        )}
      </div>
    </div>
  );
}
