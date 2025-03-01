import asyncHandler from "express-async-handler";

import { prisma } from "../config/prismaConfig.js";

export const createResidency = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    address,
    country,
    city,
    facilities,
    images,
    userEmail,
    propertyType,
  } = req.body.data;

  try {
    const residency = await prisma.residency.create({
      data: {
        title,
        description,
        price,
        address,
        country,
        city,
        facilities,
        images,
        owner: { connect: { email: userEmail } },
        propertyType,
      },
    });

    res.send({ message: "Residency created successfully", residency });
  } catch (err) {
    if (err.code === "P2002") {
      throw new Error("A residency with address already there");
    }
    throw new Error(err.message);
  }
});

export const updateResidency = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    price,
    address,
    country,
    city,
    facilities,
    images,
    propertyType,
  } = req.body.data;

  try {
    const residency = await prisma.residency.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        price,
        address,
        country,
        city,
        facilities,
        images,
        propertyType,
      },
    });

    res.send({ message: "Residency updated successfully", residency });
  } catch (err) {
    throw new Error(err.message);
  }
})

export const removeResidency = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.residency.delete({
    where: {
      id,
    }
  });
  return res.status(200).json({ message: "Residency removed successfully" });
})

// function to get all the documents/residencies
export const getAllResidencies = asyncHandler(async (req, res) => {
  const residencies = await prisma.residency.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  res.send(residencies);
});

// function to get a specific document/residency
export const getResidency = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const residency = await prisma.residency.findUnique({
      where: { id },
    });
    res.send(residency);
  } catch (err) {
    throw new Error(err.message);
  }
});

// function to get residency by owner
export const getResidencyByOwner = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const residency = await prisma.residency.findMany({
    where: {
      userEmail: email,
    }
  });

  return res.status(200).json(residency);
});

export const getReviews = asyncHandler(async (req, res) => {
  const { id } = req.body;
  
  if (!id) {
    return res.status(400).json({ message: "Residency id is required" });
  }

  const reviews = await prisma.review.findMany({
    where: {
      residencyID: id,
    },
    
  });

  return res.status(200).json(reviews);
})

export const submitReview = asyncHandler(async (req, res) => {
  const { rating, comment, residencyId, userEmail } = req.body;

  if (!rating || !comment || !residencyId || !userEmail) {
    return res.status(400).json({ message: "All fields are required" }); 
  }

  const review = await prisma.review.create({
    data: {
      rating,
      comment,
      residencyID: residencyId,
      userEmail,
    }
  });

  if (!review) {
    return res.status(400).json({ message: "Review not submitted" });
  }

  return res.status(200).json(review);
})

export const submitQuery = asyncHandler(async (req, res) => {
  const { name, email, question, id } = req.body;
  if (!name || !email || !question || !id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = await prisma.queries.create({
    data: {
      name,
      userEmail: email,
      question,
      residencyId: id,
    }
  });

  if (!query) {
    return res.status(400).json({ message: "Query not submitted" });
  }

  return res.status(200).json(query);
})

export const getQuery = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }

  const query = await prisma.queries.findMany({
    where: {
      residencyId: id,
    }
  });

  return res.status(200).json(query); 
})

export const findReview = asyncHandler(async (req, res) => {
  const { residencyId, userEmail } = req.body;

  if (!residencyId || !userEmail) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const review = await prisma.review.findUnique({
    where: {
      residencyID_userEmail: {
        residencyID: residencyId,
        userEmail,
      }
    }
  });

  return res.status(200).json(review);
})

export const writeAnswer = asyncHandler(async (req, res) => {
  const { answer, id } = req.body;

  if (!answer || !id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const question = await prisma.queries.update({
    where: {
      id,
    },
    data: {
      answer,
    }
  });

  return res.status(200).json(question);
})

export const getPropertyByType = asyncHandler(async (req, res) => {
  const { type } = req.body;

  if (!type) {
    return res.status(400).json({ message: "Type is required" });
  }

  const properties = await prisma.residency.findMany({
    where: {
      propertyType: type,
    }
  });

  return res.status(200).json(properties);
})
