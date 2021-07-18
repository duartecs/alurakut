import { SiteClient } from "datocms-client";

export default async function recebedorDeRequests(request, response) {
  if (request.method === "POST") {
    const TOKEN = "8cfaf98e354e91a0b2268430fa75a0";
    const client = new SiteClient(TOKEN);

    const registroCriado = await client.items.create({
      itemType: "971600",
      ...request.body,

      // title: "Teste",
      // imageUrl: "https://github.com/duartecs.png",
      // creatorSlug: "duartecs",
    });
    response.json({
      dados: "Algum dado",
      registroCriado: registroCriado,
    });
    return;
  }

  response.status(404).json({
    message: "Somente post",
  });
}
