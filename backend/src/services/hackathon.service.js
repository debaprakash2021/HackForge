import Hackathon from "../models/Hackathon.js";
import ApiError from "../utils/ApiError.js";
import { getSortOptions } from "../utils/sorting.js";
import { getPagination } from "../utils/pagination.js";



// Generate Slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
};







// Create Hackathon
export const createHackathonService = async (data, organizerId) => {
  const slug = generateSlug(data.title);

  const existingHackathon = await Hackathon.findOne({ slug });

  if (existingHackathon) {
    throw new ApiError(409, "Hackathon with this title already exists");
  }

  const hackathon = await Hackathon.create({
    ...data,
    slug,
    organizer: organizerId,
  });

  return hackathon;
};







// Get All Hackathons
// Get All Hackathons (Search + Filter + Pagination + Sorting)
export const getAllHackathonsService = async (queryParams) => {

  const {
    keyword,
    theme,
    mode,
    status,
    registrationStatus,
    minPrizePool,
    startDate,
    endDate,
    sort,
  } = queryParams;

  const query = {
    isDeleted: false,
  };

  // Search
  if (keyword && keyword.trim()) {
    query.$or = [
      {
        title: {
          $regex: keyword,
          $options: "i",
        },
      },
      {
        description: {
          $regex: keyword,
          $options: "i",
        },
      },
      {
        theme: {
          $regex: keyword,
          $options: "i",
        },
      },
      {
        venue: {
          $regex: keyword,
          $options: "i",
        },
      },
    ];
  }

  // Filters
  if (theme) {
    query.theme = theme;
  }

  if (mode) {
    query.mode = mode;
  }

  if (status) {
    query.status = status;
  }

  if (registrationStatus) {
    query.registrationStatus = registrationStatus;
  }

  if (minPrizePool) {
    query.prizePool = {
      $gte: Number(minPrizePool),
    };
  }

  if (startDate || endDate) {
    query.startDate = {};

    if (startDate) {
      query.startDate.$gte = new Date(startDate);
    }

    if (endDate) {
      query.startDate.$lte = new Date(endDate);
    }
  }

  // Pagination
  const { page, limit, skip } =
    getPagination(queryParams);

  // Sorting
  const sortOption =
    getSortOptions(sort);

  const totalHackathons =
    await Hackathon.countDocuments(query);

  const hackathons =
    await Hackathon.find(query)
      .populate("organizer", "fullName email")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

  return {
    hackathons,

    pagination: {
      page,
      limit,
      totalHackathons,
      totalPages: Math.ceil(
        totalHackathons / limit
      ),
      hasNextPage:
        page <
        Math.ceil(totalHackathons / limit),
      hasPreviousPage: page > 1,
    },
  };
};





// Get Single Hackathon
export const getHackathonByIdService = async (id) => {
  const hackathon = await Hackathon.findOne({
    _id: id,
    isDeleted: false,
  }).populate("organizer", "fullName email");

  if (!hackathon) {
    throw new ApiError(404, "Hackathon not found");
  }

  return hackathon;
};






// Update Hackathon
export const updateHackathonService = async (
  hackathonId,
  organizerId,
  data
) => {
  const hackathon = await Hackathon.findById(hackathonId);

  if (!hackathon || hackathon.isDeleted) {
    throw new ApiError(404, "Hackathon not found");
  }

  if (hackathon.organizer.toString() !== organizerId.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to update this hackathon"
    );
  }

  if (data.title) {
    data.slug = generateSlug(data.title);
  }

  const updatedHackathon = await Hackathon.findByIdAndUpdate(
    hackathonId,
    data,
    {
      new: true,
      runValidators: true,
    }
  ).populate("organizer", "fullName email");

  return updatedHackathon;
};







// Delete Hackathon (Soft Delete)
export const deleteHackathonService = async (
  hackathonId,
  organizerId
) => {
  const hackathon = await Hackathon.findById(hackathonId);

  if (!hackathon || hackathon.isDeleted) {
    throw new ApiError(404, "Hackathon not found");
  }

  if (hackathon.organizer.toString() !== organizerId.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to delete this hackathon"
    );
  }

  hackathon.isDeleted = true;

  await hackathon.save();

  return hackathon;
};


