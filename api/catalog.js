// GET /api/catalog → menus, itens e campos (o painel monta os formulários com isso)
const { MENUS } = require('../lib/catalog');

module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=300');
  return res.status(200).json(MENUS);
};
