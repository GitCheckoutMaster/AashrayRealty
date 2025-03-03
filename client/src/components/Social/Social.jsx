import { useState } from "react";
import EMICalc from "../EMICalcModal/EMICalc";
import { FaWhatsapp } from "react-icons/fa";
import { CiCalculator2 } from "react-icons/ci";
import { AiFillInstagram, AiFillFacebook } from "react-icons/ai";
import "./SocialStyle.css";

const Social = () => {
	const [opened, setOpened] = useState(false);

	return (
		<div className="social">
			<a
				href="https://api.whatsapp.com/send/?phone=917359899900&text=Please+contact+me&type=phone_number&app_absent=0"
				target="_blank"
				rel="noreferrer"
				className="social__item"
				onMouseEnter={() => {
					document.getElementById("data1").innerText = "Whatsapp";
				}}
				onMouseLeave={() => {
					document.getElementById("data1").innerText = "";
				}}
			>
				<FaWhatsapp size={30} color="white" />
				<span id="data1"></span>
			</a>
			<div
				className="social__item"
				onMouseEnter={() => {
					document.getElementById("data2").innerText = "EMI Calculator";
				}}
				onMouseLeave={() => {
					document.getElementById("data2").innerText = "";
				}}
				onClick={() => setOpened(true)}
			>
				<CiCalculator2 size={30} color="white" />
				<span id="data2"></span>
			</div>
			<a
				className="social__item"
				href="https://www.facebook.com/"
				target="_blank"
				rel="noreferrer"
				onMouseEnter={() => {
					document.getElementById("data3").innerText = "Facebook";
				}}
				onMouseLeave={() => {
					document.getElementById("data3").innerText = "";
				}}
			>
				<AiFillFacebook size={30} color="white" />
				<span id="data3"></span>
			</a>
			<a
				className="social__item"
				href="https://www.instagram.com/"
				target="_blank"
				rel="noreferrer"
				onMouseEnter={() => {
					document.getElementById("data4").innerText = "Instagram";
				}}
				onMouseLeave={() => {
					document.getElementById("data4").innerText = "";
				}}
			>
				<AiFillInstagram size={30} color="white" />
				<span id="data4"></span>
			</a>
			<EMICalc opened={opened} setOpened={setOpened} />
		</div>
	);
};

export default Social;
