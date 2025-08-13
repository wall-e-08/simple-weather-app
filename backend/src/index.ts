import dotenv from "dotenv";
import app from "./app";


dotenv.config();

const PORT = process.env.PORT as string || 3001;

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
