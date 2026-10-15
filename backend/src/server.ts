import mongoose from "mongoose"; import { app } from "./app.js"; import { env } from "./config/env.js";
await mongoose.connect(env.MONGO_URI);
app.listen(env.PORT, () => console.log(`Noor API on :${env.PORT}`));
