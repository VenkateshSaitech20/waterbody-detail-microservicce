const express = require('express');
const cors = require('cors')
const app = express();
app.use(express.json());
app.use(cors());
const path = require('path');
require('dotenv').config();
const setCSPHeaders = require('./middleware/csp-middleware');
app.use(setCSPHeaders);
const PORT = process.env.PORT || 4001;

const geoJsonFolderPath = path.join(__dirname, 'geojson-files');
app.use('/geojson-files', express.static(geoJsonFolderPath));

const apiRouter = require('./apiRouter');
app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log("App is running on port : ", PORT);
})