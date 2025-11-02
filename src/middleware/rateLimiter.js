import ratelimit from "../config/upstash.js";

const ratelimiter = async(req,res,next)=>{
    try {
        //in real world you need to use your user-id or real ıp adress
        const {success} = await ratelimit.limit("my-rate-limit");
        if(!success){
            return res.status(429).json({
                message:"Too many request!!!"
            })
        }
        next(); // Call next() when rate limit is successful
    } catch (error) {
        console.log("Rate limit error", error);
        next(error);
    }
};

export default ratelimiter;