const paginate = ({ page = 1, limit = 10 }) => {

    page = Number(page);
    limit = Number(limit);

    if (page < 1) page = 1;

    if (limit < 1) limit = 10;

    const skip = (page - 1) * limit;

    return {
        page,
        limit,
        skip,
    };

};

module.exports = paginate;