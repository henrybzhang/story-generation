import dotenv from "dotenv";
import path from "path";

// Construct the absolute path to the .env file in the current working directory
const envPath = path.resolve(process.cwd(), ".env");
console.log("Attempting to load .env from:", envPath);

// Load the environment variables from that specific file path
dotenv.config({ path: envPath });

// For debugging, you can log to confirm it's loaded
// console.log(process.env);
