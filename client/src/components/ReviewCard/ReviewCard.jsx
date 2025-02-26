import React from "react";

const ReviewCard = ({ reviewData }) => {
	return (
    <div>
      { reviewData.comment } <br />
      { reviewData.rating } stars given by { reviewData.userEmail }
    </div>
  );
};

export default ReviewCard;
