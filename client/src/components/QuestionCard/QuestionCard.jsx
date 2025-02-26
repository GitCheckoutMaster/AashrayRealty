import React from "react";
import "./QuestionCardStyle.css";
import { writeAnswer } from "../../utils/api";
import { toast } from "react-toastify";
import { MdOutlineQuestionAnswer } from "react-icons/md";

const QuestionCard = ({ questionData }) => {
  const isAdmin = JSON.parse(localStorage.getItem("user")).isAdmin;
  /*
    createdAt: "2025-02-18T16:35:59.060Z"
    id: "67b4b6ef657d5d9de1651499"
    name: "Jay Mistry"
    question: "First question for testing........ ?"
    residencyId: "67a642a9a8dc05a8665c79aa"
    updatedAt: "2025-02-18T16:35:59.060Z"
    userEmail: "jaymistry31170@gmail.com"
  */

  const handleAnswer = async () => {
    const answer = document.querySelector(".answer-textarea").value;
    if (!answer) {
      alert("Please write answer");
      return;
    }

    const token = localStorage.getItem("access_token");
    const res = await writeAnswer({answer, id: questionData.id}, token);

    console.log(res);
    toast.success("Answer submitted successfully", {position:"bottom-right"});
  }

  return (
    <div className="question-card">
      <div className="user-info">
        <span>{questionData.name}</span>
        <div>{new Date(questionData.createdAt).toLocaleDateString()}</div>
      </div>
      <div className="question-info">
        <div className="question">{questionData.question}</div>
        {
         questionData.answer ? (
          <div className="answer-info">
            <div>
              <div className="answer-heading">{<MdOutlineQuestionAnswer />} Answer</div>
              <div className="answer">{questionData.answer}</div>
            </div>
            <div className="answer-date">{questionData.answer && new Date(questionData.updatedAt).toLocaleDateString()}</div>
          </div>
         ) : (
          isAdmin ? (
            <div className="write-answer">
              <div>Write answer</div>
              <textarea className="answer-textarea" />
              <button className="button" onClick={handleAnswer}>Answer</button>
            </div>
          ) : (
            <div className="answer-info">
              <div className="answer">Answer is pending</div>
            </div>
          )
         )
        }
      </div>
    </div>
  )
};

export default QuestionCard;
