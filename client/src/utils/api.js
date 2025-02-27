import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";

export const api = axios.create({
	baseURL: "http://localhost:8000/api",
});

export const getAllProperties = async () => {
	try {
		const response = await api.get("/residency/allresd", {
			timeout: 10 * 1000,
		});

		if (response.status === 400 || response.status === 500) {
			throw response.data;
		}
		return response.data;
	} catch (error) {
		toast.error("Something went wrong");
		throw error;
	}
};

export const getProperty = async (id) => {
	try {
		const response = await api.get(`/residency/${id}`, {
			timeout: 10 * 1000,
		});

		if (response.status === 400 || response.status === 500) {
			throw response.data;
		}
		return response.data;
	} catch (error) {
		toast.error("Something went wrong");
		throw error;
	}
};

export const createUser = async (email, token) => {
	try {
		const { data } = await api.post(
			`/user/register`,
			{ email },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		localStorage.setItem("user", JSON.stringify(data.user));
	} catch (error) {
		toast.error("Something went wrong, Please try again");
		throw error;
	}
};

export const bookVisit = async (date, propertyId, email, token) => {
	try {
		await api.post(
			`/user/bookVisit/${propertyId}`,
			{
				email,
				id: propertyId,
				date: dayjs(date).format("DD/MM/YYYY"),
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
	} catch (error) {
		toast.error("Something went wrong, Please try again");
		throw error;
	}
};

export const removeBooking = async (id, email, token) => {
	try {
		await api.post(
			`/user/removeBooking/${id}`,
			{
				email,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
	} catch (error) {
		toast.error("Something went wrong, Please try again");

		throw error;
	}
};

export const toFav = async (id, email, token) => {
	try {
		await api.post(
			`/user/toFav/${id}`,
			{
				email,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
	} catch (e) {
		throw e;
	}
};

export const getAllFav = async (email, token) => {
	if (!token) return;
	try {
		const res = await api.post(
			`/user/allFav`,
			{
				email,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return res.data["favResidenciesID"];
	} catch (e) {
		toast.error("Something went wrong while fetching favs");
		throw e;
	}
};

export const getAllBookings = async (email, token) => {
	if (!token) return;
	try {
		const res = await api.post(
			`/user/allBookings`,
			{
				email,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return res.data["bookedVisits"];
	} catch (error) {
		toast.error("Something went wrong while fetching bookings");
		throw error;
	}
};

export const createResidency = async (data, token) => {
	console.log("Create Residency: ", data);
	try {
		const res = await api.post(
			`/residency/create`,
			{
				data,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
	} catch (error) {
		throw error;
	}
};

export const removeResidency = async (id, token) => {
	console.log("Remove Residency: ", token);
	try {
		await api.get(`/residency/remove/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	} catch (error) {
		throw error;
	}
};

export const addAdmin = async (email, token) => {
	console.log("Add admin: ", email);
	try {
		const res = await api.post(
			`/user/addAdmin`,
			{ email },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return res;
	} catch (error) {
		throw error;
	}
};

export const removeAdmin = async (email, token) => {
	console.log("Remove admin: ", email);
	try {
		const res = await api.post(
			`/user/removeAdmin`,
			{ email },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return res;
	} catch (error) {
		throw error;
	}
};

export const getResidencyByOwner = async ({ email, token }) => {
	console.log("Get Residency By Owner: ", email);
	try {
		const res = await api.post(
			`/residency/getByOwner`,
			{ email },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return res.data;
	} catch (error) {
		throw error;
	}
};

export const getReviews = async (id) => {
	//   console.log("Get Reviews: ", id);
	try {
		const { data } = await api.post(`/residency/getReviews`, { id });

		const avgRating =
			data.reduce((acc, review) => acc + review.rating, 0) / data.length;

		return { data, avgRating };
	} catch (error) {
		throw error;
	}
};

export const submitReview = async (data, token) => {
	try {
		// console.log(data);
		const res = await api.post(`/residency/submitReview`, data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return res;
	} catch (error) {
		throw error;
	}
};

export const submitQuery = async (data, token) => {
	try {
		const res = await api.post(`/residency/submitQuery`, data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return res;
	} catch (error) {
		throw error;
	}
};

export const getQuery = async (data) => {
	try {
		const res = await api.post(`/residency/findQuery`, { id: data });
		return res.data;
	} catch (error) {
		throw error;
	}
};

export const findReview = async (residencyId, userEmail, token) => {
	try {
		const res = await api.post(
			`/residency/findReview`,
			{ residencyId, userEmail },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return res.data;
	} catch (error) {
		throw error;
	}
};

export const writeAnswer = async (data, token) => {
	try {
		const res = await api.post(`/residency/writeAnswer`, data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return res.data;
	} catch (error) {
		throw error;
	}
}

export const getCustomers = async (token, setCustomer) => {
  try {
    const res = await api.get(`/user/getCustomers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setCustomer(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export const editProfile = async (data, token) => {
	try {
		const res = await api.post(`/user/editProfile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
	} catch (error) {
		throw error;
	}
}
