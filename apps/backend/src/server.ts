import "./load-env.js";
import app from "../app.js";

interface Config {
  port: number;
  nodeEnv: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
};

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
