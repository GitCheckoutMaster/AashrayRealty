import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import "./Ratings.css";

const StarRating = ({ ratings }) => {
	let rating = Math.floor(ratings);

  // if (ratings === undefined) {
  //   const [rating, setRating] = useState(0);
  //   return (
  //     <div className="ratingWrapper">
  //       {[...Array(5)].map((star, i) => {
  //         if (rating <= i) {
  //           return (
  //             <FaStar className="star" key={i} values={i} color="#e0e0e0" onClick={() => setRating(i+1)} />
  //           );
  //         } else {
  //           return (
  //             <FaStar className="star" key={i} values={i} color="orange" onClick={() => setRating(i+1)} />
  //           );
  //         }
  //       })}
  //     </div>
  //   )
  // }

	return (
		<div className="ratingWrapper">
			{[...Array(5)].map((star, i) => {
				rating = rating - 1;
				return rating >= 0 ? (
					<FaStar key={i} className="star" color="orange" />
				) : (
					<FaStar className="star" key={i} color="#e0e0e0" />
				);
			})}
		</div>
	);
};

export default StarRating;
