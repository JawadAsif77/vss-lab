export default {

  async fetch(request, env) {

    const url = new URL(request.url);

    // CREATE TABLE
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT
      )
    `).run();


    // ADD RECORD
    if(url.pathname === "/add" && request.method === "POST"){

      const body = await request.json();

      const { name, email } = body;

      await env.DB.prepare(`
        INSERT INTO users (name, email)
        VALUES (?, ?)
      `)
      .bind(name, email)
      .run();

      return new Response(
        JSON.stringify({
          success:true
        }),
        {
          headers:{
            "Content-Type":"application/json"
          }
        }
      );
    }


    // GET RECORDS
    if(url.pathname === "/list"){

      const { results } = await env.DB.prepare(`
        SELECT * FROM users
        ORDER BY id DESC
      `).all();

      return new Response(
        JSON.stringify(results),
        {
          headers:{
            "Content-Type":"application/json"
          }
        }
      );
    }


    return new Response("Worker Running Successfully");

  }

}
