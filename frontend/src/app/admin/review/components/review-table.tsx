/* eslint-disable @next/next/no-img-element */
import { Review, ReviewWithProduct } from "@/types/review.type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faReply, faPen } from "@fortawesome/free-solid-svg-icons";
import React, { Fragment } from "react";
import { formatDateWithRelative } from "@/utils/time";
import TextCollapse from "@/components/text-collapse";

export default function ReviewTable({
  reviews,
  handleOpenReplyDialog,
}: {
  reviews: ReviewWithProduct[];
  handleOpenReplyDialog: (review: Review) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="hidden lg:flex items-center gap-10 px-4 py-2 bg-gray-200 text-gray-700">
        <div className="w-[400px]">Product Info</div>
        <div className="flex-1">Review Content</div>
      </div>
      {reviews.map((review) => (
        <Fragment key={review._id}>
          <div className="md:px-4 py-2 lg:flex items-start gap-10 space-y-2 lg:space-y-0">
            {/* Product Info */}
            <div className="bg-gray-100 px-4 py-4 lg:px-0 lg:py-0 lg:bg-transparent w-full lg:w-[400px] flex items-center gap-4">
              <img
                src={
                  review.product.images.length !== 0
                    ? review.product.images[0]
                    : ""
                }
                alt=""
                className="w-20 h-20 object-cover"
              />
              <p className="line-clamp-2">{review.product.name}</p>
            </div>
            {/* Content Info */}
            <div className="flex-1 space-y-2">
              <div className="p-4 lg:px-0 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1">
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
                    <p className="ml-4 text-gray-500">
                      {formatDateWithRelative(review.createdAt)}
                    </p>
                  </div>
                  {!review.shopReply && (
                    <button
                      onClick={() => handleOpenReplyDialog(review)}
                      className="py-1 px-3 flex items-center gap-2 bg-black text-white cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faReply} className="w-5 h-5" />
                      <p>Reply</p>
                    </button>
                  )}
                </div>
                <TextCollapse text={review.content} />
                {review.images.length !== 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {review.images.map((imageUrl, idx) => (
                      <img
                        src={imageUrl}
                        alt=""
                        key={idx}
                        className="w-20 h-20 object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>
              {review.shopReply && (
                <div className="py-2 px-4 bg-gray-100 flex items-start justify-between gap-4">
                  <TextCollapse text={review.shopReply} />
                  <button
                    onClick={() => handleOpenReplyDialog(review)}
                    className="cursor-pointer shrink-0"
                  >
                    <FontAwesomeIcon icon={faPen} className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="border-t border-gray-500"></div>
        </Fragment>
      ))}
    </div>
  );
}
