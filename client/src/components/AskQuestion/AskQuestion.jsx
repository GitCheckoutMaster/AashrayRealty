import React, { useEffect } from "react";
import "./AskQuestionStyle.css";
import { submitQuery } from "../../utils/api";
import { toast } from "react-toastify";

const AskQuestion = ({ visible, propertyId, setVisible }) => {

	useEffect(() => {
		const ele = document.getElementById("askQuestion");
		
		if (visible) {
		  ele.classList.remove("askQuestionOut");
		  ele.classList.add("askQuestionIn");
		} else {
		  ele.classList.remove("askQuestionIn");
		  ele.classList.add("askQuestionOut");
		}
	}, [visible]);

  const handleSubmit = async () => {
    const name = document.getElementById("name").value;
    const question = document.getElementById("question").value;
	const email = JSON.parse(localStorage.getItem("user")).email;

	const res = await submitQuery({ name, email, question, id: propertyId }, localStorage.getItem("access_token"));
	// console.log(res);
	if (res.status === 200) {
		toast.success("Question submitted successfully", {position:"bottom-right"});
		setVisible(false);
	}
  }

	return (
		<div className='defaultAskQuestion' id="askQuestion">
			<span className="mainHeading">Ask A Question</span>
			<div className="questionForm">
				<div className="nameInputWrapper">
					<label htmlFor="name">Name</label>
					<input type="text" id="name" />
				</div>
				<div className="questionInputWrapper">
					<label htmlFor="question">Question</label>
					<textarea id="question" placeholder="Ask your question here" />
				</div>
			</div>
			<button className="button" onClick={handleSubmit}>Submit Question</button>
		</div>
	);
};

export default AskQuestion;
