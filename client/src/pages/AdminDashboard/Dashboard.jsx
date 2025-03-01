import { useEffect, useState } from "react";
import "./AdminDashboard.css";
import AddPropertyModal from "../../components/AddPropertyModal/AddPropertyModal";
import useAuthCheck from "../../hooks/useAuthCheck";
import {
	addAdmin as addAdminAPI,
	removeAdmin as removeAdminAPI,
} from "../../utils/api";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
// swiper imports
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
	const [addProperty, setAddProperty] = useState(false);
	const navigate = useNavigate();
	const { validateLogin } = useAuthCheck();
	const user = JSON.parse(localStorage.getItem("user"));

	if (user.isAdmin === false) {
		return <div>Unauthorized</div>;
	}

	useEffect(() => {
		if (!user.canAddAdmin) {
			document.getElementById("removable1").style.display = "none";
			document.getElementById("removable2").style.display = "none";
		}
	}, []);

	const handleAddPropertyClick = () => {
		if (validateLogin()) {
			setAddProperty(true);
		}
	};

	return (
		<div className="sidebar">
			<div className="sidebar-items">
				<div className="sidebar-title">Dashboard</div>
				<div className="sidebar-item" onClick={handleAddPropertyClick}>
					Add Property
				</div>
				<div
					className="sidebar-item"
					onClick={() => navigate("/dashboard/update-property")}
				>
					Update Property
				</div>
				<div className="sidebar-item" id="removable1">
					Add Admin
				</div>
				<div className="sidebar-item" id="removable2">
					Remove Admin
				</div>
				<div className="sidebar-item" onClick={() => navigate("/dashboard/customers")}>
					Customers
				</div>
			</div>
			<AddPropertyModal opened={addProperty} setOpened={setAddProperty} />
		</div>
	);
};

export default Dashboard;

const SlideNextButton = () => {
	const swiper = useSwiper();
	return (
		<div className="flexCenter r-buttons">
			<button onClick={() => swiper.slidePrev()} className="r-prevButton">
				&lt;
			</button>
			<button onClick={() => swiper.slideNext()} className="r-nextButton">
				&gt;
			</button>
		</div>
	);
};

const Properties = ({ properties, deleteProperty }) => {
	return (
		deleteProperty && (
			<div className="properties">
				{properties?.length > 0 && (
					<Swiper slidesPerView={2}>
						<SlideNextButton />
						{properties.map((property, idx) => (
							<SwiperSlide key={idx}>
								<PropertyCard card={property} isDelete={true} />
							</SwiperSlide>
						))}
					</Swiper>
				)}
			</div>
		)
	);
};

const AddAdmin = ({ addAdmin }) => {
	const [email, setEmail] = useState("");

	const handleChange = (e) => {
		setEmail(e.target.value);
	};

	const handleClick = async () => {
		const res = addAdminAPI(email, localStorage.getItem("access_token"));
		console.log(res);
	};

	return (
		addAdmin && (
			<div className="addAdmin">
				<input type="text" placeholder="Enter email" onChange={handleChange} />
				<button onClick={handleClick}>Add Admin</button>
			</div>
		)
	);
};

const RemoveAdmin = ({ removeAdmin }) => {
	const [email, setEmail] = useState("");

	const handleChange = (e) => {
		setEmail(e.target.value);
	};

	const handleClick = async () => {
		const res = removeAdminAPI(email, localStorage.getItem("access_token"));
		console.log(res);
	};

	return (
		removeAdmin && (
			<div className="removeAdmin">
				<input type="text" placeholder="Enter email" onChange={handleChange} />
				<button onClick={handleClick}>Remove Admin</button>
			</div>
		)
	);
};
