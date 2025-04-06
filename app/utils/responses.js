exports.success = (res, data, code = 200) => res.status(code).json({ data });

exports.paginated = (res, data, code = 200) => {
  const responseData = {
    ...data,
    data: data.docs,
    page: parseInt(data.page, 10) || 1,
  };
  delete responseData.docs;

  return res.status(code).json(responseData);
};

exports.error = (res, error = 'Oops. An Error Occurred', code = 500) => res.status(code).json({ error });
