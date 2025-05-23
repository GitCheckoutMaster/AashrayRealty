import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { createPayment, getProperty, getQuery, getReviews, removeBooking } from "../../utils/api";
import { PuffLoader } from "react-spinners";
import "./Property.css";
import { FaShower } from "react-icons/fa";
import { AiTwotoneCar } from "react-icons/ai";
import { MdLocationPin, MdMeetingRoom } from "react-icons/md";
import Map from "../../components/Map/Map";
import useAuthCheck from "../../hooks/useAuthCheck";
import { useAuth0 } from "@auth0/auth0-react";
import BookingModal from "../../components/BookingModal/BookingModal";
import UserDetailContext from "../../context/UserDetailContext.js";
import { Button } from "@mantine/core";
import { toast } from "react-toastify";
import Heart from "../../components/Heart/Heart";
import StarRating from "../../components/StarRating/StarRating.jsx";
import WriteUserReview from "../../components/WriteUserReview/WriteUserReview.jsx";
import ReviewCard from "../../components/ReviewCard/ReviewCard.jsx";
import AskQuestion from "../../components/AskQuestion/AskQuestion.jsx";
import QuestionCard from "../../components/QuestionCard/QuestionCard.jsx";
import ImageSlider from "../../components/ImageSlider/ImageSlider.jsx";
import Swal from "sweetalert2";


const Property = () => {
  const { pathname } = useLocation();
  const id = pathname.split("/").slice(-1)[0];
  const { data, isLoading, isError } = useQuery(["resd", id], () =>
    getProperty(id)
  );
  const { data: reviewData } = useQuery("reviews", () => getReviews(id));
  const { data: questionData } = useQuery("questions", () => getQuery(id));
 
  const [modalOpened, setModalOpened] = useState(false);
  const { validateLogin } = useAuthCheck();
  const { user } = useAuth0();
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [writeReview, setWriteReview] = useState(false);
  const [askAQuestion, setAskAQuestion] = useState(false);
  const [reviewSelected, setReviewSelected] = useState(true);

  useEffect (() => {
    setReviews(reviewData?.data);
  }, [reviewData]);

  useEffect (() => {
    setQuestions(questionData);
  }, [questionData]);

  const {
    userDetails: { token, bookings },
    setUserDetails,
  } = useContext(UserDetailContext);

  const { mutate: cancelBooking, isLoading: cancelling } = useMutation({
    mutationFn: () => {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to cancel the booking",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          removeBooking(id, user?.email, token);
        }
      });
    },
    onSuccess: () => {
      setUserDetails((prev) => ({
        ...prev,
        bookings: prev.bookings.filter((booking) => booking?.id !== id),
      }));

      toast.success("Booking cancelled", { position: "bottom-right" });
    },
  });

  const handleWriteReview = async () => {
    if (validateLogin()) {
      setWriteReview((prev) => !prev);
      const alreadySubmitted = reviews?.filter((review) => review.userEmail === user?.email).length > 0;
      if (alreadySubmitted) {
        setWriteReview(false);
        toast.error("You have already submitted a review", { position: "bottom-right" });
      }
    }
  }

  const handleAskQuestion = async () => {
    if (validateLogin()) {
      setAskAQuestion((prev) => !prev);
      const alreadySubmitted = questions?.filter((question) => question.userEmail === user?.email).length > 0;
      if (alreadySubmitted) {
        setAskAQuestion(false);
        toast.error("You have already submitted a question", { position: "bottom-right" });
      }
    }
  }

  useEffect(() => {
    let btn1, btn2;
    btn1 = document.querySelectorAll(".button2")[0];
    btn2 = document.querySelectorAll(".button2")[1]
    if (reviewSelected && btn1 && btn2) {
      btn1.classList.add("activeButton2");
      btn2.classList.remove("activeButton2");
    } else if (btn1 && btn2 && !reviewSelected) {
      btn2.classList.add("activeButton2");
      btn1.classList.remove("activeButton2");
    }
  }, [reviewSelected]);

  if (isLoading) {
    return (
      <div className="wrapper">
        <div className="flexCenter paddings">
          <PuffLoader />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="wrapper">
        <div className="flexCenter paddings">
          <span>Error while fetching the property details</span>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="flexColStart paddings innerWidth property-container">
        {/* like button */}
        <div className="like">
          <Heart id={id}/>
        </div>

        {/* image */}
        {/* <img src={data?.image} alt="home image" /> */}
        <ImageSlider images={data?.images} />

        <div className="flexCenter property-details">
          {/* left */}
          <div className="flexColStart left">
            {/* head */}
            <div className="flexStart head">
              <span className="primaryText prop-heading">{data?.title} <div className="prop-type">{data?.propertyType}</div></span>
              <span className="orangeText" style={{ fontSize: "1.5rem" }}>
                ₹ {data?.price}
              </span>
            </div>

            {/* facilities */}
            <div className="flexStart facilities">
              {/* bathrooms */}
              <div className="flexStart facility">
                <FaShower size={20} color="#1F3E72" />
                <span>{data?.facilities?.bathrooms} Bathrooms</span>
              </div>

              {/* parkings */}
              <div className="flexStart facility">
                <AiTwotoneCar size={20} color="#1F3E72" />
                <span>{data?.facilities?.parkings} Parking</span>
              </div>

              {/* rooms */}
              <div className="flexStart facility">
                <MdMeetingRoom size={20} color="#1F3E72" />
                <span>{data?.facilities?.bedrooms} Room/s</span>
              </div>
            </div>

            {/* description */}

            <span className="secondaryText" style={{ textAlign: "justify" }}>
              {data?.description}
            </span>

            {/* address */}

            <div className="flexStart" style={{ gap: "1rem" }}>
              <MdLocationPin size={25} />
              <span className="secondaryText">
                {data?.address}{" "}
                {data?.city}{" "}
                {data?.country}
              </span>
            </div>

            {/* booking button */}
            {bookings?.map((booking) => booking.id).includes(id) ? (
              <>
                <Button
                  variant="outline"
                  w={"100%"}
                  color="red"
                  onClick={() => cancelBooking()}
                  disabled={cancelling}
                >
                  <span>Cancel booking</span>
                </Button>
                <span>
                  Your visit already booked for date{" "}
                  {bookings?.filter((booking) => booking?.id === id)[0].date}
                </span>
              </>
            ) : (
              <button
                className="button"
                onClick={async () => {
                  const amount = 5500 * 100;
                  const currency = "INR";

                  if (validateLogin()) {
                    const order = await createPayment(
                      {
                        amount,
                        currency,
                        receipt: "receipt#1",
                      },
                      localStorage.getItem("access_token")
                    );

                    var options = {
                      key: "rzp_test_ra9cIN8LjOHk5O",
                      amount, 
                      currency,
                      name: "Aashray Realty", 
                      description: "Test Transaction",
                      image: "../../../public/logo.png",
                      order_id: order.id, 
                      handler: async function (response) {
                        console.log(response);

                        setModalOpened(true);
                        // const body = {
                        //   ...response,
                        // };
                
                        // const validateRes = await fetch(
                        //   "http://localhost:5000/order/validate",
                        //   {
                        //     method: "POST",
                        //     body: JSON.stringify(body),
                        //     headers: {
                        //       "Content-Type": "application/json",
                        //     },
                        //   }
                        // );
                        // const jsonRes = await validateRes.json();
                        // console.log(jsonRes);
                      },
                      prefill: {
                        //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
                        name: JSON.parse(localStorage.getItem("user")).name, //your customer's name
                        email: JSON.parse(localStorage.getItem("user")).email,
                        contact: JSON.parse(localStorage.getItem("user")).phoneNumber, //Provide the customer's phone number for better conversion rates
                      },
                      notes: {
                        address: "Razorpay Corporate Office",
                      },
                      theme: {
                        color: "#3399cc",
                      },
                    };
                    var rzp1 = new window.Razorpay(options);
                    rzp1.on("payment.failed", function (response) {
                      alert(response.error.code);
                      alert(response.error.description);
                      alert(response.error.source);
                      alert(response.error.step);
                      alert(response.error.reason);
                      alert(response.error.metadata.order_id);
                      alert(response.error.metadata.payment_id);
                    });
                    rzp1.on("payment.success", function (response) {
                      console.log(response);
                    });
                    rzp1.open();
                  }
                }}
              >
                Book your visit
              </button>
            )}

            <BookingModal
              opened={modalOpened}
              setOpened={setModalOpened}
              propertyId={id}
              email={user?.email}
            />
          </div>

          {/* right side */}
          <div className="map">
            <Map
              address={data?.address}
              city={data?.city}
              country={data?.country}
            />
          </div>
        </div>
      </div>
      <div className="flexColStart paddings innerWidth" name="reviews">
        <div className="customerReviewHeading">Customer Review</div>
        
        { /* customer overall review and stars */ }
        <div className="customerOverallReview">
          <div className="customerOverallReviewLeft">
            <div className="customerOverallRating"> {reviewData?.avgRating ? reviewData?.avgRating.toFixed(2) : 0} </div>
            <StarRating ratings={reviewData?.avgRating}/>
            <div>Based on { reviews?.length || 0 } reviews</div>
            <div className="customerReviewStats">
              <div>5 Stars: <ProgressBar rating={(reviews?.filter((review) => review.rating === 5).length) / reviews?.length} /></div>
              <div>4 Stars: <ProgressBar rating={(reviews?.filter((review) => review.rating === 4).length) / reviews?.length} /></div>
              <div>3 Stars: <ProgressBar rating={(reviews?.filter((review) => review.rating === 3).length) / reviews?.length} /></div>
              <div>2 Stars: <ProgressBar rating={(reviews?.filter((review) => review.rating === 2).length) / reviews?.length} /></div>
              <div>1 Stars: <ProgressBar rating={(reviews?.filter((review) => review.rating === 1).length) / reviews?.length} /></div>
            </div>
          </div>
          <div>
            <button className="button writeReviewBtn" onClick={handleAskQuestion}>Ask a Question</button>
            <button className="button writeReviewBtn" onClick={handleWriteReview}>Write a review</button>
          </div>
        </div>

        { /* Writing and question part for customer (toggled by a button) */}
        <AskQuestion visible={askAQuestion} propertyId={id} setVisible={setAskAQuestion} />
        <WriteUserReview writeReview={writeReview} propertyId={id} setWriteReview={setWriteReview} />

        <div className="ReviewQuestionSelection">
          <button className="button2 activeButton2" onClick={() => setReviewSelected(true)}>Reviews {reviews?.length}</button>
          <button className="button2" onClick={() => setReviewSelected(false)}>Queries {questions?.length}</button>
        </div>
        { /* customer reviews */}
        <div className="customerReviewAndQuestion">
          {reviewSelected ? reviews?.map((review, idx) => {
              return <ReviewCard reviewData={review} />
            }): questions?.map((question, idx) => {
              return <QuestionCard questionData={question} />
            })
          }
        </div>
      </div>
    </div>
  );
};

export default Property;

const ProgressBar = ({ rating }) => {
  if (!rating) {
    return <div className="progress-bar"><div className="progress" style={{ width: "0%" }}><span>0%</span></div></div>;
  }
  return (
    <div className="progress-bar">
      <div
        className="progress"
        style={{ width: `${rating * 100}%` }}
      ><span>{Math.floor(rating*100)}%</span></div>
    </div>
  );
}
