const returnError = (statusCode, message, errorData = []) => {
  return {
    statusCode,
    response: {
      status: false,
      code: statusCode,
      message,
      errors: errorData,
      meta: {
          mode: process.env.NODE_ENV === 'production' ? 'Production' : 'Sandbox',
          timestamp: new Date().toISOString(),
      },
    },
  };
};
const returnSuccess = (statusCode, message, data = {}, collection = null) => {
  return {
    response: {
      status: true,
      code: statusCode,
      message,
      data: ((collection) ? collection(data.paginatedData) : data.paginatedData) || data,
      meta: {
          mode: process.env.NODE_ENV === 'production' ? 'Production' : 'Sandbox',
          timestamp: new Date().toISOString(),
      },
    },
    meta: data.meta,
  };
};

const paginate = async (model, queryOptions, page = 1, perPage = 10) => {
  const pageInt = parseInt(page, 10);
  const perPageInt = parseInt(perPage, 10);

  const limit = perPageInt;
  const offset = (pageInt - 1) * perPageInt;
  const optionsCount = {
    ...queryOptions,
    distinct: true, // to avoid counts of joined tables
  };
  const options = {
    ...queryOptions,
    distinct: true, // to avoid counts of joined tables
    limit,
    offset,
  };
  const countQuery =  model.count(optionsCount);
  const dataQuery =  model.findAll(options);

  const [results, totalRecords] = await Promise.all([dataQuery, countQuery]);

  const total = Array.isArray(totalRecords) ? totalRecords.length : totalRecords;
  const totalPages = Math.ceil(total / limit);

  return {
    paginatedData: results,
    meta: {
      total: total,
      last_page: totalPages,
      current_page: pageInt,
    },
  };
};

const consoleError = (log) => {
    console.log("-------------------------- Console Data Start --------------------------------------")
        console.log(log)
    console.log("-------------------------- Console Data End --------------------------------------")
}
module.exports = {
  returnError,
  returnSuccess,
  paginate,
  consoleError
};
