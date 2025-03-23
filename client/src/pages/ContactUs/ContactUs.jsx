import "./ContactUsStyle.css";
import { FaLocationArrow } from "react-icons/fa";
import { IoIosCall } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import emailjs from "emailjs-com";
import { useState } from "react";
import { useForm } from "react-hook-form";

const ContactUs = () => {
	const { register, handleSubmit, errors } = useForm();
	const [emailData, setEmailData] = useState({
		from_email: "",
		to_email: "",
		message: "",
		title: "",
	});
	emailjs.init({
		publicKey: "aGWi-04P3pLksXvNs",
		// Do not allow headless browsers
		blockHeadless: true,
		blockList: {
			// Block the suspended emails
			list: ["foo@emailjs.com", "bar@emailjs.com"],
			// The variable contains the email address
			watchVariable: "userEmail",
		},
		limitRate: {
			// Set the limit rate for the application
			id: "app",
			// Allow 1 request per 10s
			throttle: 10000,
		},
	});

	const submitHandler = (data) => {
		setEmailData({
			from_email: data.email,
			to_email: "jaymistry31170@gmail.com",
			message: data.message,
			title: data.subject,
		});

		console.log(emailData);

		emailjs
			.send("service_nkbuewg", "template_odooqwq", emailData, "aGWi-04P3pLksXvNs")
			.then((response) => {
				console.log("Email Sent!", response);
				alert("Email Sent Successfully!");
			})
			.catch((error) => {
				console.log("Error:", error);
				alert("Failed to send email!");
			});
	};

	return (
		<div className="contact-us">
			<h1>Contact Us</h1>
			<div className="contact-us-container">
				<div className="company-info">
					<div className="company-info-item">
						<FaLocationArrow size={25} style={{ marginTop: "5px" }} />
						<div>
							<h3>Address</h3>
							<p>1234 Street Name, City Name, Country Name</p>
						</div>
					</div>
					<div className="company-info-item">
						<IoIosCall size={25} style={{ marginTop: "5px" }} />
						<div>
							<h3>Phone Number</h3>
							<p>Office: 123456789</p>
							<p>Mobile: 123456789</p>
						</div>
					</div>
					<div className="company-info-item">
						<MdEmail size={25} style={{ marginTop: "5px" }} />
						<div>
							<h3>Email</h3>
							<p>example@gmail.com</p>
						</div>
					</div>
				</div>
				<div className="contact-form">
					<form onSubmit={handleSubmit(submitHandler)}>
						<input
							{...register("firstName")}
							type="text"
							placeholder="First Name"
						/>
						<input
							{...register("lastName")}
							type="text"
							placeholder="Last Name"
						/>
						<input {...register("email")} type="email" placeholder="Email" />
						<input {...register("subject")} type="text" placeholder="Subject" />
						<textarea {...register("message")} placeholder="Message"></textarea>
						<button type="submit" className="button">
							Submit
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ContactUs;
