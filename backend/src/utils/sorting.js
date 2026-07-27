export const getSortOptions = (sort) => {
  switch (sort) {
    case "latest":
      return { createdAt: -1 };

    case "oldest":
      return { createdAt: 1 };

    case "title":
      return { title: 1 };

    case "start_date":
      return { startDate: 1 };

    case "end_date":
      return { endDate: 1 };

    case "registration_deadline":
      return { registrationDeadline: 1 };

    case "prize_desc":
      return { prizePool: -1 };

    case "prize_asc":
      return { prizePool: 1 };

    default:
      return { createdAt: -1 };
  }
};