export default {
  async fetch(request, env, ctx) {
    if (request.method !== "GET") {
      return new Response("Acesso negado.", { status: 405 });
    }

    const url = new URL(request.url);
    const userKey = url.searchParams.get("key");
    const userHwid = url.searchParams.get("hwid");
    
    const serviceId = "drivingempireparadoxall"; 

    if (!userKey || !userHwid) {
      return new Response(JSON.stringify({ success: false, message: "Faltando Key ou HWID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const pandaUrl = `https://api.pandadevelopment.net/v4/keys/validate?service_id=${serviceId}&key=${userKey}&hwid=${userHwid}`;

    try {
      const pandaResponse = await fetch(pandaUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json'
        }
      });

      const data = await pandaResponse.text();

      return new Response(data, {
        status: pandaResponse.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        }
      });

    } catch (error) {
      return new Response(JSON.stringify({ success: false, message: "Erro no Proxy: " + error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  },
};
