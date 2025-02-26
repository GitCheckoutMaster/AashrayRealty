import "./ImageSliderStyles.css";
import React, { useState } from "react";

const ImageSlider = ({ images }) => {
	const [currentImage, setCurrentImage] = useState(0);
	const handleScroll = () => {
		console.log("here");
		const navTag = document.getElementById((currentImage + 1) % images.length);
		navTag.click();
	};

	return (
		<div className="image-slider-wrapper">
			<div className="image-slider" onScroll={handleScroll}>
				{images.map((image, idx) => (
					<img src={image} key={idx} alt="" id={idx} />
				))}
			</div>
			<div className="slider-nav">
				{images.map((_, idx) => (
					<a
						href={"#" + idx}
            className={currentImage === idx ? "active" : ""}
						id={idx}
						key={idx}
						onClick={() => setCurrentImage(idx)}
					></a>
				))}
			</div>
		</div>
	);
};

export default ImageSlider;
