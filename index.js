const http = require('http');
const url = require('url');

const server = http.createServer(async (req, res) => {
  // Permite que o Roblox leia a resposta sem bloquear
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  // 1. Rejeita qualquer coisa que não seja requisição GET
  if (req.method !== 'GET') {
    res.writeHead(405);
    return res.end(JSON.stringify({ success: false, message: 'Acesso negado.' }));
  }

  // 2. Pega a Key e o HWID da URL
  const parsedUrl = url.parse(req.url, true);
  const userKey = parsedUrl.query.key;
  const userHwid = parsedUrl.query.hwid;

  const serviceId = "drivingempireparadoxall";

  if (!userKey || !userHwid) {
    res.writeHead(400);
    return res.end(JSON.stringify({ success: false, message: "Faltando Key ou HWID" }));
  }

  // 3. Monta o link oficial do Panda Auth
  const pandaUrl = `https://api.pandadevelopment.net/v4/keys/validate?service_id=${serviceId}&key=${userKey}&hwid=${userHwid}`;

  try {
    // 4. Faz a requisição pro Panda
    const pandaResponse = await fetch(pandaUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json'
      }
    });

    const data = await pandaResponse.text();

    // 5. Devolve a resposta pro seu script
    res.writeHead(pandaResponse.status);
    res.end(data);

  } catch (error) {
    res.writeHead(500);
    res.end(JSON.stringify({ success: false, message: "Erro no Proxy: " + error.message }));
  }
});

// Define a porta que o Render vai usar e escuta em 0.0.0.0
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
