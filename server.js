// import express from "express";
// import "dotenv/config";
// import cors from "cors";
// import Routes from "./routes/index.js";

// import passport from "passport";
// import session from "express-session";

// const app = express();
// const PORT = process.env.PORT || 5000;


// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(Routes);

// app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));


import express from "express";
import "dotenv/config";
import cors from "cors";
import passport from "passport";
import session from "express-session";

import Routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'm!uZ5fLyDHKf?me',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());

import {} from "./services/googleStrategy.js";
import {} from "./services/facebookStrategy.js";

app.use(Routes);

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));

