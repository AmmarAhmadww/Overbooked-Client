// GET endpoint for recent reading activity with pagination
router.get('/reading-activity/recent', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5; // Number of activities per page
    const skip = (page - 1) * limit;

    const activities = await ReadingActivity.aggregate([
      {
        $lookup: {
          from: 'books',
          localField: 'bookId',
          foreignField: '_id',
          as: 'bookDetails'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $unwind: '$bookDetails'
      },
      {
        $unwind: '$userDetails'
      },
      {
        $project: {
          bookName: '$bookDetails.bookName',
          bookCover: '$bookDetails.cover',
          userName: '$userDetails.username',
          page: 1,
          timestamp: 1
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]);

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}); 