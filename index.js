const express = require('express');
const app = express();
const siteRouter = require('./routers/router');
const Path = require('path');

const PORT = process.env.PORT ?? 3000;






app.use(express.json());
app.use(express.static(Path.resolve(__dirname, 'src')));
app.use(siteRouter);





app.listen(PORT, () => {
    console.log('Server has been started on port 3000...')
})