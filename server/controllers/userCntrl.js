import asyncHandler from "express-async-handler";
import { ADMIN } from "../constant.js";
import { prisma } from "../config/prismaConfig.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";

export const createUser = asyncHandler(async (req, res) => {
	let { email } = req.body;
	const userExists = await prisma.user.findUnique({ where: { email: email } });
	if (!userExists) {
		const user = await prisma.user.create({
			data: {
				email,
				isAdmin: ADMIN.includes(email),
				canAddAdmin: ADMIN.includes(email),
			},
		});
		return res.status(200).json({ message: "User created", user });
	} else {
		const user = await prisma.user.update({
			where: { email: email },
			data: {
				isAdmin: ADMIN.includes(email),
				canAddAdmin: ADMIN.includes(email),
			},
		});
		return res.status(200).json({ message: "User already registered", user });
	}
});

// function to book a visit to residency
export const bookVisit = asyncHandler(async (req, res) => {
	const { email, date } = req.body;
	const { id } = req.params;

	try {
		const alreadyBooked = await prisma.user.findUnique({
			where: { email },
			select: { bookedVisits: true },
		});

		if (alreadyBooked.bookedVisits.some((visit) => visit.id === id)) {
			res
				.status(400)
				.json({ message: "This residency is already booked by you" });
		} else {
			await prisma.user.update({
				where: { email: email },
				data: {
					bookedVisits: { push: { id, date } },
				},
			});
      await prisma.residency.update({
        where: { id },
        data: {
          bookedBy: email,
        }
      })
			res.send("your visit is booked successfully");
		}
	} catch (err) {
		throw new Error(err.message);
	}
});

// funtion to get all bookings of a user
export const getAllBookings = asyncHandler(async (req, res) => {
	const { email } = req.body;
	try {
		const bookings = await prisma.user.findUnique({
			where: { email },
			select: { bookedVisits: true },
		});
		res.status(200).send(bookings);
	} catch (err) {
		throw new Error(err.message);
	}
});

// function to cancel the booking
export const cancelBooking = asyncHandler(async (req, res) => {
	const { email } = req.body;
	const { id } = req.params;
	try {
		const user = await prisma.user.findUnique({
			where: { email: email },
			select: { bookedVisits: true },
		});

		const index = user.bookedVisits.findIndex((visit) => visit.id === id);

		if (index === -1) {
			res.status(404).json({ message: "Booking not found" });
		} else {
			user.bookedVisits.splice(index, 1);
			await prisma.user.update({
				where: { email },
				data: {
					bookedVisits: user.bookedVisits,
				},
			});

      await prisma.residency.update({
        where: { id },
        data: {
          bookedBy: null,
        }
      })

			res.send("Booking cancelled successfully");
		}
	} catch (err) {
		throw new Error(err.message);
	}
});

// function to add a resd in favourite list of a user
export const toFav = asyncHandler(async (req, res) => {
	const { email } = req.body;
	const { rid } = req.params;

	try {
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (user.favResidenciesID.includes(rid)) {
			const updateUser = await prisma.user.update({
				where: { email },
				data: {
					favResidenciesID: {
						set: user.favResidenciesID.filter((id) => id !== rid),
					},
				},
			});

			res.send({ message: "Removed from favorites", user: updateUser });
		} else {
			const updateUser = await prisma.user.update({
				where: { email },
				data: {
					favResidenciesID: {
						push: rid,
					},
				},
			});
			res.send({ message: "Updated favorites", user: updateUser });
		}
	} catch (err) {
		throw new Error(err.message);
	}
});

// function to get all favorites
export const getAllFavorites = asyncHandler(async (req, res) => {
	const { email } = req.body;
	try {
		const favResd = await prisma.user.findUnique({
			where: { email },
			select: { favResidenciesID: true },
		});
		res.status(200).send(favResd);
	} catch (err) {
		throw new Error(err.message);
	}
});

// function to add a new admin
export const addAdmin = asyncHandler(async (req, res) => {
	const { email } = req.body;
	if (ADMIN.includes(email)) {
		return res.status(400).send({ message: "Already an admin" });
	}
	try {
		const updatedUser = await prisma.user.update({
			where: { email: email },
			data: {
				isAdmin: true,
				canAddAdmin: false,
			},
		});
		ADMIN.push(email);
		return res.status(200).send({ message: "Admin added", user: updatedUser });
	} catch (error) {
		return res.status(400).send({ message: "Email doesn't exists" });
	}
});

// function to remove an admin
export const removeAdmin = asyncHandler(async (req, res) => {
	const { email } = req.body;
	if (!ADMIN.includes(email)) {
		return res.status(400).send({ message: "Not an admin" });
	}
	try {
		const updatedUser = await prisma.user.update({
			where: { email: email },
			data: {
				isAdmin: false,
				canAddAdmin: false,
			},
		});
		ADMIN.splice(ADMIN.indexOf(email), 1);
		return res.status(200).send({ message: "Admin removed", user: updatedUser });
	} catch (error) {
		return res.status(400).send({ message: "Email doesn't exists" });
	}
});

// function to get all users
export const getAllUsers = asyncHandler(async (req, res) => {
	const users = await prisma.user.findMany();
	return res.status(200).json(users);
});

export const editProfile = asyncHandler(async (req, res) => {
	const { email, name, phoneNumber, address } = req.body;
	const image = req.file?.path;

  if (!image) {
    const user = await prisma.user.update({
      where: { email },
      data: {
        name,
        phoneNumber,
        address,
      },
    });
    return res.status(200).json(user);
  }
  
	const imgUrl = await uploadOnCloudinary(image);
	const user = await prisma.user.update({
		where: { email },
		data: {
			name,
			phoneNumber,
			address,
			image: imgUrl.url,
		},
	});
	return res.status(200).json(user);
})
