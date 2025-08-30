import { Review } from "@/types/review.type";
import { useState } from "react";

export function useReplyDialog() {
  const [isOpenReplyDialog, setIsOpenReplyDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review>();

  const handleOpenReplyDialog = (review: Review) => {
    setSelectedReview(review);
    setIsOpenReplyDialog(true);
  };
  const handleCloseReplyDialog = () => {
    setSelectedReview(undefined);
    setIsOpenReplyDialog(false);
  };
  return {
    isOpenReplyDialog,
    selectedReview,
    handleOpenReplyDialog,
    handleCloseReplyDialog,
  };
}
