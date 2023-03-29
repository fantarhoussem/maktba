require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

///APP.USE
const app = express();
app.use(express.json());
app.use(cors());


///Connect ot mongoDB
const URI = process.env.mongo_url
;
mongoose.connect(
    URI,  
      console.log('connected to mongoDB')
    
  );
////Routes
app.use('/user', require('./routes/userRouter'));
//app.use('/api', require('./routes/categoryRouter'));
//app.use('/api', require('./routes/upload'));
//app.use('/api', require('./routes/ProductRoute'));
//listen To Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('server is running on port', PORT);
});
