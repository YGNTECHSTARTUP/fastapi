import { Redis } from "@upstash/redis/cloudflare"
import { Hono } from "hono"
import { env } from "hono/adapter"
import { handle } from "hono/vercel"
import {cors} from "hono/cors"
export const runtime = "edge"

type EnvConfig = {
    UPSTASH_REDIS_REST_TOKEN:string,
    UPSTASH_REDIS_REST_URL:string
}

const app = new Hono().basePath("/api")
app.use('/*',cors())
app.get("/search",async (c)=>{
  try{
    const {UPSTASH_REDIS_REST_TOKEN,UPSTASH_REDIS_REST_URL} = env<EnvConfig>(c)
    
    const start = performance.now()
    const redis = new Redis({
        url: UPSTASH_REDIS_REST_URL,
        token: UPSTASH_REDIS_REST_TOKEN
    })
    
    const querys = c.req.query("q")
    const query = querys?.toUpperCase()
    if(!query) return c.json({
        message:"Query is required"
    ,status:400})

    const res = []
 
    const rank = await redis.zrank("terms",query)

    if(rank !== null && rank !== undefined){
       const ranks = await redis.zrange<string[]>("terms",rank,rank+100)
       for(const r of ranks){
         if(!r.startsWith(query))
            {
              break
            }
            if(r.endsWith('*'))
                {
                    res.push(r.substring(0,r.length-1))
                }
       }
    }
    const end = performance.now()



    return c.json({
        results:res,
        delay:end-start
    })
  }
  catch(e){
    console.log(e)
    return c.json({
        results:[],
        message:"Internal Server Error",
        status:500
    })
  }
})

export const GET = handle(app)
export default app as never
