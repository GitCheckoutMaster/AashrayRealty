import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import "./UserReview.css";
import { toast } from "react-toastify";
import { submitReview } from "../../utils/api";

const WriteUserReview = ({ writeReview, propertyId, setWriteReview }) => {
	const [rating, setRating] = useState(0);

	useEffect(() => {
		const ele = document.getElementById("writeReview");

		if (writeReview) {
			ele.classList.remove("writeReviewOut");
			ele.classList.add("writeReviewIn");
		} else {
			ele.classList.remove("writeReviewIn");
			ele.classList.add("writeReviewOut");
		}
	}, [writeReview]);

	const handleSubmit = async () => {
		const review = document.getElementById("userReview").value;
		const data = {
			rating,
			comment: review,
			residencyId: propertyId,
			userEmail: JSON.parse(localStorage.getItem("user")).email,
		};

		const res = await submitReview(data, localStorage.getItem("access_token"));
		if (res.status === 200) {
			toast.success("Review submitted successfully", {
				position: "bottom-right",
			});
			setWriteReview(false);
		}
		setRating(0);
	};

	return (
		<div
			className="defaultWriteReview"
			style={{ display: "flex", flexDirection: "column" }}
			id="writeReview"
		>
			<div className="customerRatings">
				<div>Rating</div>
				<div className="ratingWrapper">
					{[...Array(5)].map((star, i) => {
						if (rating <= i) {
							return (
								<FaStar
									className="star"
									key={i}
									values={i}
									color="#e0e0e0"
									onClick={() => setRating(i + 1)}
								/>
							);
						} else {
							return (
								<FaStar
									className="star"
									key={i}
									values={i}
									color="orange"
									onClick={() => setRating(i + 1)}
								/>
							);
						}
					})}
				</div>
			</div>
			<span>Write a review of this property</span>
			<textarea id="userReview" />
			<button className="button" onClick={handleSubmit}>
				Submit
			</button>
		</div>
	);
};

export default WriteUserReview;
