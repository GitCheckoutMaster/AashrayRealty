import React from "react";
import './PropertyCard.css'
import {truncate} from 'lodash'
import { useNavigate } from "react-router-dom";
import Heart from "../Heart/Heart";
import Swal from "sweetalert2";
import { removeResidency } from "../../utils/api";


const PropertyCard = ({ card, isDelete }) => {

  const navigate = useNavigate();
  return (
    <div className="flexColStart r-card"
    onClick={()=>{
      if (!isDelete) {
        navigate(`../properties/${card.id}`)
      } else {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to undo this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel!",
        }).then((result) => {
          if (result.isConfirmed) {
            removeResidency(card.id, localStorage.getItem("access_token"))
          }
        });
      }
    }}
    >
      <Heart id={card?.id}/>
      <img src={card.image} alt="home" />
      <span className="secondaryText r-price">
        <span style={{ color: "orange" }}>$</span>
        <span>{card.price}</span>
      </span>
      <span className="primaryText">{truncate(card.title, {length: 15})}</span>
      <span className="secondaryText">{truncate(card.description, {length: 80})}</span>
    </div>
  );
};

export default PropertyCard;
