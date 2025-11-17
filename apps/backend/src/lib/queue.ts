import { Queue } from "bullmq";
import { redisConnection } from "./redisConnection.js";

// This queue 'analysis' name is the key. It connects the producer and consumer.
// It assumes Redis is running on localhost:6379
export const analysisQueue = new Queue("story-analysis", {
  connection: redisConnection,
});
