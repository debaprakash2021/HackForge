import User from "../models/User.js";
import Hackathon from "../models/Hackathon.js";
import Team from "../models/Team.js";
import Registration from "../models/Registration.js";
import Submission from "../models/Submission.js";
import Review from "../models/Review.js";

import { ROLES } from "../constants/roles.js";

export const getAdminDashboardService = async () => {

    /* -------------------------------------------------------------------------- */
    /*                               Overview                                     */
    /* -------------------------------------------------------------------------- */

    const [
        totalUsers,
        totalHackathons,
        totalTeams,
        totalRegistrations,
        totalSubmissions,
        totalReviews,
    ] = await Promise.all([
        User.countDocuments(),
        Hackathon.countDocuments({ isDeleted: false }),
        Team.countDocuments({ isDeleted: false }),
        Registration.countDocuments({ isDeleted: false }),
        Submission.countDocuments({ isDeleted: false }),
        Review.countDocuments({ isDeleted: false }),
    ]);

    /* -------------------------------------------------------------------------- */
    /*                              User Statistics                               */
    /* -------------------------------------------------------------------------- */

    const [
        admins,
        organizers,
        judges,
        participants,
        blockedUsers,
        verifiedUsers,
        unverifiedUsers,
    ] = await Promise.all([
        User.countDocuments({
            role: ROLES.ADMIN,
        }),

        User.countDocuments({
            role: ROLES.ORGANIZER,
        }),

        User.countDocuments({
            role: ROLES.JUDGE,
        }),

        User.countDocuments({
            role: ROLES.PARTICIPANT,
        }),

        User.countDocuments({
            isBlocked: true,
        }),

        User.countDocuments({
            isEmailVerified: true,
        }),

        User.countDocuments({
            isEmailVerified: false,
        }),
    ]);

    /* -------------------------------------------------------------------------- */
    /*                          Hackathon Statistics                              */
    /* -------------------------------------------------------------------------- */

    const [
        upcomingHackathons,
        ongoingHackathons,
        completedHackathons,
        registrationOpen,
        registrationClosed,
    ] = await Promise.all([
        Hackathon.countDocuments({
            status: "Upcoming",
            isDeleted: false,
        }),

        Hackathon.countDocuments({
            status: "Ongoing",
            isDeleted: false,
        }),

        Hackathon.countDocuments({
            status: "Completed",
            isDeleted: false,
        }),

        Hackathon.countDocuments({
            registrationStatus: "Open",
            isDeleted: false,
        }),

        Hackathon.countDocuments({
            registrationStatus: "Closed",
            isDeleted: false,
        }),
    ]);

    /* -------------------------------------------------------------------------- */
    /*                        Registration Statistics                             */
    /* -------------------------------------------------------------------------- */

    const [
        pendingRegistrations,
        approvedRegistrations,
        rejectedRegistrations,
        cancelledRegistrations,
    ] = await Promise.all([
        Registration.countDocuments({
            status: "Pending",
            isDeleted: false,
        }),

        Registration.countDocuments({
            status: "Approved",
            isDeleted: false,
        }),

        Registration.countDocuments({
            status: "Rejected",
            isDeleted: false,
        }),

        Registration.countDocuments({
            status: "Cancelled",
            isDeleted: false,
        }),
    ]);

    /* -------------------------------------------------------------------------- */
    /*                         Submission Statistics                              */
    /* -------------------------------------------------------------------------- */

    const [
        draftSubmissions,
        submittedSubmissions,
        lockedSubmissions,
        reviewedSubmissions,
    ] = await Promise.all([
        Submission.countDocuments({
            status: "Draft",
            isDeleted: false,
        }),

        Submission.countDocuments({
            status: "Submitted",
            isDeleted: false,
        }),

        Submission.countDocuments({
            status: "Locked",
            isDeleted: false,
        }),

        Submission.countDocuments({
            status: "Reviewed",
            isDeleted: false,
        }),
        
    ]);

    /* -------------------------------------------------------------------------- */
/*                           Recent Users                                     */
/* -------------------------------------------------------------------------- */

const recentUsers = await User.find()
    .select("-password")
    .sort({ createdAt: -1 })
    .limit(5);

/* -------------------------------------------------------------------------- */
/*                        Recent Hackathons                                   */
/* -------------------------------------------------------------------------- */

const recentHackathons = await Hackathon.find({
    isDeleted: false,
})
.populate("organizer", "fullName email")
.sort({ createdAt: -1 })
.limit(5);

/* -------------------------------------------------------------------------- */
/*                           Recent Teams                                     */
/* -------------------------------------------------------------------------- */

const recentTeams = await Team.find({
    isDeleted: false,
})
.populate("leader", "fullName email")
.populate("hackathon", "title")
.sort({ createdAt: -1 })
.limit(5);

/* -------------------------------------------------------------------------- */
/*                     Recent Registrations                                   */
/* -------------------------------------------------------------------------- */

const recentRegistrations = await Registration.find({
    isDeleted: false,
})
.populate("team", "teamName")
.populate("hackathon", "title")
.sort({ createdAt: -1 })
.limit(5);

/* -------------------------------------------------------------------------- */
/*                      Recent Submissions                                    */
/* -------------------------------------------------------------------------- */

const recentSubmissions = await Submission.find({
    isDeleted: false,
})
.populate("team", "teamName")
.populate("hackathon", "title")
.sort({ createdAt: -1 })
.limit(5);

/* -------------------------------------------------------------------------- */
/*                         Recent Reviews                                     */
/* -------------------------------------------------------------------------- */

const recentReviews = await Review.find({
    isDeleted: false,
})
.populate("judge", "fullName")
.populate("submission", "projectTitle")
.sort({ createdAt: -1 })
.limit(5);


// Calculate monthly user statistics
const monthlyUsers = await User.aggregate([
    {
        $group: {
            _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
            },
            total: {
                $sum: 1,
            },
        },
    },
    {
        $sort: {
            "_id.year": 1,
            "_id.month": 1,
        },
    },
]);



// Calculate monthly hackathon statistics
const monthlyHackathons = await Hackathon.aggregate([
    {
        $match: {
            isDeleted: false,
        },
    },
    {
        $group: {
            _id: {
                year: {
                    $year: "$createdAt",
                },
                month: {
                    $month: "$createdAt",
                },
            },
            total: {
                $sum: 1,
            },
        },
    },
    {
        $sort: {
            "_id.year": 1,
            "_id.month": 1,
        },
    },
]);


// Calculate monthly team statistics
const monthlySubmissions = await Submission.aggregate([
    {
        $match: {
            isDeleted: false,
        },
    },
    {
        $group: {
            _id: {
                year: {
                    $year: "$createdAt",
                },
                month: {
                    $month: "$createdAt",
                },
            },
            total: {
                $sum: 1,
            },
        },
    },
    {
        $sort: {
            "_id.year": 1,
            "_id.month": 1,
        },
    },
]);


const roleDistribution = await User.aggregate([
    {
        $group: {
            _id: "$role",
            total: {
                $sum: 1,
            },
        },
    },
]);




const submissionStatusDistribution =
await Submission.aggregate([
    {
        $match: {
            isDeleted: false,
        },
    },
    {
        $group: {
            _id: "$status",
            total: {
                $sum: 1,
            },
        },
    },
]);



const hackathonStatusDistribution =
await Hackathon.aggregate([
    {
        $match: {
            isDeleted: false,
        },
    },
    {
        $group: {
            _id: "$status",
            total: {
                $sum: 1,
            },
        },
    },
]);






const topHackathons =
await Hackathon.find({
    isDeleted: false,
})
.select(
    "title registrationCount prizePool status"
)
.sort({
    registrationCount: -1,
})
.limit(5);




const topProjects =
await Review.aggregate([
    {
        $group: {
            _id: "$submission",
            averageScore: {
                $avg: "$totalScore",
            },
            reviews: {
                $sum: 1,
            },
        },
    },
    {
        $sort: {
            averageScore: -1,
        },
    },
    {
        $limit: 5,
    },
    {
        $lookup: {
            from: "submissions",
            localField: "_id",
            foreignField: "_id",
            as: "submission",
        },
    },
    {
        $unwind: "$submission",
    },
    {
        $project: {
            averageScore: 1,
            reviews: 1,
            projectTitle:
                "$submission.projectTitle",
        },
    },
]);






    return {

        overview: {
            totalUsers,
            totalHackathons,
            totalTeams,
            totalRegistrations,
            totalSubmissions,
            totalReviews,
        },

        users: {
            admins,
            organizers,
            judges,
            participants,
            blockedUsers,
            verifiedUsers,
            unverifiedUsers,
        },

        hackathons: {
            upcomingHackathons,
            ongoingHackathons,
            completedHackathons,
            registrationOpen,
            registrationClosed,
        },

        registrations: {
            pendingRegistrations,
            approvedRegistrations,
            rejectedRegistrations,
            cancelledRegistrations,
        },

        submissions: {
            draftSubmissions,
            submittedSubmissions,
            lockedSubmissions,
            reviewedSubmissions,
        },
    recentActivity: {

    users: recentUsers,

    hackathons: recentHackathons,

    teams: recentTeams,

    registrations: recentRegistrations,

    submissions: recentSubmissions,

    reviews: recentReviews,
    },

    analytics: {

    monthlyUsers,

    monthlyHackathons,

    monthlySubmissions,

    roleDistribution,

    submissionStatusDistribution,

    hackathonStatusDistribution,

    topHackathons,

    topProjects,

},


    };
};