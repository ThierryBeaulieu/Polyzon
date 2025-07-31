const express = require('express');
const cors = require('cors');
const { dbService } = require('./services/database.service');
const productRouter = require('./routes/products');
const purchaseRouter = require('./routes/purchases');
const searchBarRouter = require('./routes/search_bar');
const DB_CONSTS = require('./utils/env');
const path = require('path');

const app = express();
const PORT = 5020;
const SIZE_LIMIT = '10mb';
const PUBLIC_PATH = path.join(__dirname);

// TODO  : Configurer le serveur pour accepter les requêtes de n'importe quelle origine
app.use(cors({ origin: '*' }));

// affichage de nouvelles requêtes dans la console
app.use((request, response, next) => {
  console.log(`New HTTP request: ${request.method} ${request.url}`);
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: SIZE_LIMIT }));
app.use(express.static(PUBLIC_PATH));

app.use('/api/products', productRouter.router);
app.use('/api/purchases', purchaseRouter.router);
app.use('/api/search', searchBarRouter.router);

const server = app.listen(PORT, () => {
  dbService.connectToServer(DB_CONSTS.DB_URL).then(() => {
    // TODO : peupler la base de données avec les données de products.json
    productRouter.productService.populateDb();
    // eslint-disable-next-line no-console
    console.log(`Listening on port ${PORT}.`);
  });
});

module.exports = server;
