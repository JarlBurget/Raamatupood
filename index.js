const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

const db = require('./utils/db')

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', {
        pageTitle: 'Page Not Found',
        path: '/404'
    })
})

app.listen(3030, () => {
    console.log('Server is connected');
});