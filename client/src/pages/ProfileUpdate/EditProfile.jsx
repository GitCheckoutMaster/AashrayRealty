import { useAuth0 } from "@auth0/auth0-react";
import "./EditProfileStyle.css";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { editProfile } from "../../utils/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditProfile = () => {
	const user = JSON.parse(localStorage.getItem("user"));
	const altAvatar = useAuth0().user?.picture;
  const userSub = useAuth0().user?.sub;
	const {
		register,
		handleSubmit,
		formState: { errors },
    setValue,
	} = useForm();
  const navigate = useNavigate();

	const [newImage, setNewImage] = useState(user?.image || altAvatar);

	const onSubmit = async (data) => {
    let token = undefined;
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("address", data.address);
    formData.append("image", data.image);
    formData.append("email", user.email);

		const res = await editProfile(
			formData,
			localStorage.getItem("access_token")
		);

    const authRes = await axios.patch(
      "https://dev-rbujbb6dqoi1nwk7.us.auth0.com/api/v2/users/" + userSub,
      {
        picture: res.data.image,
      },
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        }
      }
    )

    console.log(authRes);

    if (authRes.status === 200) {
      toast.success("Profile updated successfully", {
				position: "bottom-right",
			});
    }

		if (res.status === 200) {
			toast.success("Profile updated successfully", {
				position: "bottom-right",
			});
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/");
		}
	};

	const handleImageChange = (e) => {
    const file = e.target.files[0];
		setNewImage(URL.createObjectURL(file));
    setValue("image", file);
	};

	return (
		<div className="root">
			<div className="edit-profile">
				<h2>Edit Profile</h2>
				<img
					src={newImage}
					alt=""
					onClick={() => document.getElementById("fileInput").click()}
				/>
				<div className="errors"></div>
				<div className="errors">
					{errors.name && <span>Name is required</span>}
					{errors.phoneNumber && <span>Enter valid phone number</span>}
					{errors.address && <span>Address is required</span>}
				</div>
				<form action="" onSubmit={handleSubmit(onSubmit)}>
					<input
						type="file"
						id="fileInput"
						style={{ display: "none" }}
						multiple={false}
						onChange={handleImageChange}
					/>

					<div className="input-wrapper">
						<span htmlFor="name">Name</span>
						<input type="text" value={user?.name} {...register("name", { required: true })} />
					</div>
					<div className="input-wrapper">
						<span htmlFor="phone">Phone</span>
						<input
							type="text"
              value={user?.phoneNumber}
							{...register("phoneNumber", {
								required: true,
								pattern: /^\d{10}$/,
							})}
						/>
					</div>
					<div className="input-wrapper">
						<span htmlFor="address">Address</span>
						<textarea value={user?.address} {...register("address", { required: true })} />
					</div>
					<button
						type="submit"
						style={{ width: "100%", marginTop: "10px" }}
						className="button"
					>
						Update Profile
					</button>
				</form>
			</div>
		</div>
	);
};

export default EditProfile;
