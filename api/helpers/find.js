const error404 = (req, res) => {
  res.status(404);
  res.json({
    error: 'Not found'
  });
};

// This feels over-abstracted - consider shrinking again now that error404 exists.
const findAll = (model, query) => (
  model.findAll({ where: query })
);

const findByPk = (model, pk) => (
  model.findByPk(pk)
);

const findAllResponse = (model, query, res) => (
  findAll(model, query).then(result => res.json(result))
);

const findByPkResponse = (model, pk, res) => (
  findByPk(model, pk).then(result => {
    if (result) {
      res.json(result);
    } else {
      // It would be more proper to accept a req object into this function,
      // but it is not needed.
      error404(null, res);
    }
  })
);

module.exports = {
  findAllResponse,
  findByPkResponse
};
