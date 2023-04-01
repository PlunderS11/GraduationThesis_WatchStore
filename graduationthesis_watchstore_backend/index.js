const express = require('express');
const cors = require('cors');
const { connectDB } = require('./database/db');
const { PORT } = require('./utils/config');

const auth = require('./routers/auth');
const userRoute = require('./routers/userRoute');
const productRoute = require('./routers/productRoute');
const collectionRoute = require('./routers/collectionRoute');
const orderRoute = require('./routers/orderRoute');
const promotionRoute = require('./routers/promotionRoute');
const rankRoute = require('./routers/rankRoute');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', auth);
app.use('/api/user', userRoute);
app.use('/api/product', productRoute);
app.use('/api/collections', collectionRoute);
app.use('/api/order', orderRoute);
app.use('/api/promotion', promotionRoute);
app.use('/api/rank', rankRoute);

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
