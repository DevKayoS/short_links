import fastify from "fastify";
import {z} from "zod"
import {sql} from "./lib/postgres"
import postgres from "postgres";


const app = fastify()


app.get('/:code', async (request, reply)=> {
  const {code} = z.object({
    code: z.string().min(3),
  }).parse(request.params)

  const result = await sql/*sql*/`
    SELECT id, original_url
    FROM short_links
    WHERE short_links.code = ${code}
  `
   const link = result[0]

   if(result.length === 0){
    return reply.status(400).send({message: 'Link not found'})
   }

   return reply.redirect(301, link.original_url)
})

app.get('/api/links', async () => {
  const result = await sql/*sql*/`
    SELECT *
    FROM short_links
    ORDER BY created_at DESC
  `

  return result
})

app.post('/api/links', async (request, reply )=> {
  const {code, url} = z.object({
    code: z.string().min(3),
    url: z.string().url(),
  }).parse(request.body)

  try {
    const result = await sql/*sql*/`
    INSERT INTO short_links (code, original_url)
    VALUES (${code}, ${url})
    RETURNINg id
  ` 

  const link =result[0]

  return reply.status(201).send({shortLinkId: link.id})
  } catch (err) {
    if (err instanceof postgres.PostgresError) {
      if(err.code === '23505'){
        return reply.status(400).send({message: "Duplicated Code"})
      }
    }

    console.log(err)

    return reply.status(500).send({message: "Internal Error"})
  }
})

app.listen({
  port: 3333,

}).then(() => {
  console.log("HTTP server running")
})