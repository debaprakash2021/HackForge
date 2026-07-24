import Submission from "../models/Submission.js";
import Registration from "../models/Registration.js";
import Team from "../models/Team.js";
import Hackathon from "../models/Hackathon.js";

import ApiError from "../utils/ApiError.js";

//Create Submission
export const createSubmissionService = async (
  leaderId,
  data
) => {
  const registration = await Registration.findById(data.registration);

  if (!registration || registration.isDeleted) {
    throw new ApiError(404, "Registration not found");
  }

  if (registration.status !== "Approved") {
    throw new ApiError(
      400,
      "Registration is not approved"
    );
  }

  const team = await Team.findById(registration.team);

  if (!team || team.isDeleted) {
    throw new ApiError(404, "Team not found");
  }

  if (team.leader.toString() !== leaderId.toString()) {
    throw new ApiError(
      403,
      "Only team leader can submit"
    );
  }

  const hackathon = await Hackathon.findById(registration.hackathon);

  if (!hackathon) {
    throw new ApiError(404, "Hackathon not found");
  }

  if (new Date() > hackathon.endDate) {
    throw new ApiError(
      400,
      "Submission deadline has passed"
    );
  }

  const existingSubmission = await Submission.findOne({
    registration: registration._id,
    isDeleted: false,
  });

  if (existingSubmission) {
    throw new ApiError(
      400,
      "Submission already exists"
    );
  }

  const submission = await Submission.create({
    registration: registration._id,
    team: team._id,
    hackathon: hackathon._id,
    projectTitle: data.projectTitle,
    projectDescription: data.projectDescription,
    githubRepo: data.githubRepo,
    liveDemo: data.liveDemo,
    videoDemo: data.videoDemo,
    techStack: data.techStack,
    ppt: data.ppt,
    documentation: data.documentation,
    thumbnail: data.thumbnail,
    status: "Submitted",
  });

  return await Submission.findById(submission._id)
    .populate({
      path: "team",
      populate: {
        path: "leader members.user",
        select: "name email",
      },
    })
    .populate("registration")
    .populate("hackathon");
};

// Update Submission 
export const updateSubmissionService = async (
  submissionId,
  leaderId,
  data
) => {
  const submission = await Submission.findById(submissionId);

  if (!submission || submission.isDeleted) {
    throw new ApiError(404, "Submission not found");
  }

  if (submission.status === "Locked") {
    throw new ApiError(
      400,
      "Submission has been locked"
    );
  }

  const team = await Team.findById(submission.team);

  if (team.leader.toString() !== leaderId.toString()) {
    throw new ApiError(
      403,
      "Only leader can edit submission"
    );
  }

  Object.assign(submission, data);

  await submission.save();

  return submission;
};


//Get My Submission
export const getMySubmissionService = async (leaderId) => {
  const team = await Team.findOne({
    leader: leaderId,
    isDeleted: false,
  });

  if (!team) {
    throw new ApiError(
      404,
      "No team found"
    );
  }

  const submission = await Submission.findOne({
    team: team._id,
    isDeleted: false,
  })
    .populate("registration")
    .populate("hackathon")
    .populate({
      path: "team",
      populate: {
        path: "leader members.user",
        select: "name email",
      },
    });

  if (!submission) {
    throw new ApiError(
      404,
      "Submission not found"
    );
  }

  return submission;
};



//Get All Submissions of Hackathon

export const getHackathonSubmissionsService = async (
  hackathonId,
  organizerId
) => {
  const hackathon = await Hackathon.findById(hackathonId);

  if (!hackathon) {
    throw new ApiError(
      404,
      "Hackathon not found"
    );
  }

  if (hackathon.organizer.toString() !== organizerId.toString()) {
    throw new ApiError(
      403,
      "Unauthorized"
    );
  }

  return await Submission.find({
    hackathon: hackathonId,
    isDeleted: false,
  })
    .populate("registration")
    .populate({
      path: "team",
      populate: {
        path: "leader members.user",
        select: "name email",
      },
    });
};