import Hackathon from "../models/Hackathon.js";
import ApiError from "../utils/ApiError.js";




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
export const getAllHackathonsService = async () => {
  return await Hackathon.find({ isDeleted: false })
    .populate("organizer", "fullName email")
    .sort({ createdAt: -1 });
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





// Search Hackathons
// Search Hackathons
export const searchHackathonsService = async (keyword) => {

  const query = {
    isDeleted: false,
  };

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

  return await Hackathon.find(query)
    .populate("organizer", "fullName email")
    .sort({
      createdAt: -1,
    });
};




// Filter Hackathons
export const filterHackathonsService = async (filters) => {

  const query = {
    isDeleted: false,
  };

  // Theme
  if (filters.theme) {
    query.theme = filters.theme;
  }

  // Mode
  if (filters.mode) {
    query.mode = filters.mode;
  }

  // Status
  if (filters.status) {
    query.status = filters.status;
  }

  // Registration Status
  if (filters.registrationStatus) {
    query.registrationStatus =
      filters.registrationStatus;
  }

  // Minimum Prize Pool
  if (filters.minPrizePool) {
    query.prizePool = {
      $gte: Number(filters.minPrizePool),
    };
  }

  // Date Range
  if (filters.startDate || filters.endDate) {
    query.startDate = {};

    if (filters.startDate) {
      query.startDate.$gte = new Date(
        filters.startDate
      );
    }

    if (filters.endDate) {
      query.startDate.$lte = new Date(
        filters.endDate
      );
    }
  }

  return await Hackathon.find(query)
    .populate("organizer", "fullName email")
    .sort({
      startDate: 1,
    });
};