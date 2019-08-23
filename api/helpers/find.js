const ERROR_404 = { error: 'Not found' };

const findAll = (model, query, res) => (
  model.findAll({ where: query }).then(result => res.json(result))
);

const findByPk = (model, pk, res) => (
  model.findByPk(pk).then(result => {
    if (result) {
      res.json(result);
    } else {
      res.status(404);
      res.json(ERROR_404);
    }
  })
);

module.exports = {
  findAll,
  findByPk
};
