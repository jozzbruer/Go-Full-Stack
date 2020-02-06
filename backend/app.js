const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Product = require('./models/Products');

mongoose.connect("Mongo db link",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => console.log("Connection success"))
.catch(() => console.log("Connection Failed"))

const app = express();

app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());

app.post('/api/products',(request, response, next) => {
    const product = new Product({
        ...request.body
    });
    product.save()
    .then((product) => response.status(200).json({ product }))
    .catch(error => response.status(400).json({ error }));
});

app.put('/api/products/:id',(request, response, next) => {
    Product.updateOne({ _id: request.params.id }, { ...request.body, _id: request.params.id })
    .then(() => response.status(200).json({ message: 'Modified' }))
    .catch(error => response.status(400).json({ error }));
});

app.delete('/api/products/:id', (request, response, next) => {
    Product.deleteOne({ _id: request.params.id })
    .then(() => response.status(200).json({ message: 'Deleted' }))
    .catch(error => response.status(400).json({ error }));
});

app.get('/api/products/:id',(request, response, next) => {
    Product.findOne({ _id: request.params.id })
    .then(product => response.status(200).json({product: product}))
    .catch(error => response.status(400).json({ error }));
})
app.get('/api/products/', (request, response, next) => {
    Product.find()
    .then(products => response.status(200).json({products: products}))
    .catch(error => response.status(404).json({ error }))
} );


module.exports = app;