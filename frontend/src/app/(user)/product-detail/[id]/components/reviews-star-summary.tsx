import { Progress } from "@/components/ui/progress";
import { SummaryReviewType } from "@/types/review.type";
import {
  faStar as faSolidStar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function ReviewsStarSummary({
  summary,
}: {
  summary: SummaryReviewType;
}) {
  const getTotalReviews = () => {
    const totalCount = summary
      ? Object.values(summary).reduce((acc, count) => acc + count, 0)
      : 0;
    return totalCount;
  };

  const getAverageScore = () => {
    const totalScore = summary
      ? Object.entries(summary).reduce(
          (acc, [rating, count]) => acc + Number(rating) * count,
          0
        )
      : 0;
    const totalCount = getTotalReviews();
    const average = totalCount > 0 ? totalScore / totalCount : 0;
    return average;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, idx) => {
            const average = getAverageScore();
            const starValue = idx + 1;

            if (average >= starValue) {
              // sao đầy
              return (
                <FontAwesomeIcon
                  key={idx}
                  icon={faSolidStar}
                  size="xl"
                  className="w-16 h-16 text-orange-400"
                />
              );
            } else if (average >= starValue - 0.5) {
              // nửa sao
              return (
                <FontAwesomeIcon
                  key={idx}
                  icon={faStarHalfAlt}
                  size="xl"
                  className="w-16 h-16 text-orange-400"
                />
              );
            } else {
              // sao rỗng
              return (
                <FontAwesomeIcon
                  key={idx}
                  icon={faRegularStar}
                  size="xl"
                  className="w-16 h-16 text-orange-400"
                />
              );
            }
          })}
        </div>
        <p className="font-medium text-2xl">{getAverageScore().toFixed(1)}</p>
      </div>
      <div className="border border-gray-200"></div>

      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map((star) => {
          const totalCount = getTotalReviews();
          const count = summary[star] ?? 0;
          const percent = totalCount > 0 ? (count / totalCount) * 100 : 0;

          return (
            <div key={star} className="flex items-center gap-4">
              <p className="text-gray-400 w-4 leading-none text-right">
                {star}
              </p>
              <Progress
                value={percent}
                className="h-3 flex-1 bg-gray-200 rounded-none [&>div]:bg-orange-400"
              />
              <p className="w-10 text-right leading-none truncate">{count}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
