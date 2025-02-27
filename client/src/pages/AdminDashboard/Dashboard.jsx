import { useEffect, useState } from "react";
import "./AdminDashboard.css";
import AddPropertyModal from "../../components/AddPropertyModal/AddPropertyModal";
import useAuthCheck from "../../hooks/useAuthCheck";
import { getResidencyByOwner, addAdmin as addAdminAPI, removeAdmin as removeAdminAPI, getCustomers } from "../../utils/api";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
// swiper imports
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import { PuffLoader } from "react-spinners";


const Dashboard = () => {
	const [addProperty, setAddProperty] = useState(false);
  const [deleteProperty, setDeleteProperty] = useState(false);
  const [addAdmin, setAddAdmin] = useState(false);
  const [removeAdmin, setRemoveAdmin] = useState(false);
  const [customerList, setCustomerList] = useState(false);
  
	const [properties, setProperties] = useState([]);
	const { validateLogin } = useAuthCheck();
	const user = JSON.parse(localStorage.getItem("user"));
	const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState([]);

	if (user.isAdmin === false) {
		return <div>Unauthorized</div>;
	}

	useEffect(() => {
		if (!user.canAddAdmin) {
      document.getElementById("removable1").style.display = "none";
      document.getElementById("removable2").style.display = "none";
    }
    getCustomers(localStorage.getItem("access_token"), setCustomer);
    
  }, []);

	const handleAddPropertyClick = () => {
    setDeleteProperty(false);
    setAddAdmin(false);
    setDeleteProperty(false);
		if (validateLogin()) {
			setAddProperty(true);
			setProperties([]);
		}
	};

	const handleRemoveProperty = async () => {
		setAddProperty(false);
    setRemoveAdmin(false);
    setAddAdmin(false);
    setDeleteProperty(true);
		if (validateLogin()) {
			setLoading(true);
			const res = await getResidencyByOwner({
				email: user.email,
				token: localStorage.getItem("access_token"),
			});
			setLoading(false);
			setProperties(res);
		}
	};

  const handleAddAdmin = () => {
    setAddProperty(false);
    setDeleteProperty(false);
    setRemoveAdmin(false);
    setAddAdmin(true);
  }

  const handleRemoveAdmin = () => {
    setAddProperty(false);
    setDeleteProperty(false);
    setAddAdmin(false);
    setRemoveAdmin(true);
  }

	return (
		<div className="root">
			<div className="dashboard">
				<div className="sidebar">
					<div className="sidebar-items">
						<div className="sidebar-title">Dashboard</div>
						<div className="sidebar-item" onClick={handleAddPropertyClick}>
							Add Property
						</div>
						<div className="sidebar-item" onClick={handleRemoveProperty}>
							Remove Property
						</div>
						<div className="sidebar-item" id="removable1" onClick={handleAddAdmin}>Add Admin</div>
						<div className="sidebar-item" id="removable2" onClick={handleRemoveAdmin}>Remove Admin</div>
					</div>
				</div>
				<div className="main">
					{loading && (
						<div className="wrapper flexCenter" style={{ height: "60vh" }}>
							<PuffLoader
								height="80"
								width="80"
								radius={1}
								color="#4066ff"
								aria-label="puff-loading"
							/>
						</div>
					)}
					<AddPropertyModal opened={addProperty} setOpened={setAddProperty} />
					<Properties properties={properties} deleteProperty={deleteProperty} />
          <AddAdmin addAdmin={addAdmin} />
          <RemoveAdmin removeAdmin={removeAdmin} />
				</div>
			</div>
		</div>
	);
};

export default Dashboard;

const CustomerList = () => {

}

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

const Properties = ({properties, deleteProperty}) => {
  return deleteProperty && (
    <div className="properties" >
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
}

const AddAdmin = ({addAdmin}) => {
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  }

  const handleClick = async () => {
    const res = addAdminAPI(email, localStorage.getItem("access_token"));
    console.log(res);
  }

  return addAdmin && (
    <div className="addAdmin">
      <input type="text" placeholder="Enter email" onChange={handleChange} />
      <button onClick={handleClick}>Add Admin</button>
    </div>
  )
}

const RemoveAdmin = ({removeAdmin}) => {
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  }

  const handleClick = async () => {
    const res = removeAdminAPI(email, localStorage.getItem("access_token"));
    console.log(res);
  }

  return removeAdmin && (
    <div className="removeAdmin">
      <input type="text" placeholder="Enter email" onChange={handleChange} />
      <button onClick={handleClick}>Remove Admin</button>
    </div>
  )
}
