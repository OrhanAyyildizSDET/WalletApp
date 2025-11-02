import { Redis } from '@upstash/redis';
import { Ratelimit } from "@upstash/ratelimit";

import "dotenv/config";

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(100,"60 s"),  //only max 100 request for every minute
})

// await ratelimit.set("foo", "bar");
// await ratelimit.get("foo");
export default ratelimit;