//Authentication Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

//Pricing Routes - it will show the pricing dynamically
const pricingRoutes = require('./routes/pricingRoutes');
app.use('/api/pricing', pricingRoutes)