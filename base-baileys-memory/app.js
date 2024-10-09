const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const path = require("path")
const fs = require("fs")
const chat = require("./chatGPT.JS")
const { delay } = require('@whiskeysockets/baileys')
require("dotenv").config


const menuPath = path.join(__dirname, "mensajes", "menu.txt")
const menu = fs.readFileSync(menuPath, "utf8")

const flowPrincipal = addKeyword(['Hola', 'hola', 'alo','ola'])
    .addAnswer('🤗🙌 Hola bienvenido a este *Chatbot* de *Talita cosmeticos*, para ver las opciones que tenemos para usted escriba *OP*🤗',{
        delay: 6000,
    })
const flowCat = addKeyword(EVENTS.ACTION)
    .addAnswer("📜Aqui puede descargar catalogo que tenemos el catalogo que tenemos📜", {
        delay: 8500
    })
    .addAnswer("https://drive.google.com/file/d/1gkifv6haOq6E1_rGvtpKyk3gbg3aUUyK/view?usp=drive_link", {
        delay: 8500,
    })

const flowRedes= addKeyword(EVENTS.ACTION)
    .addAnswer("hola")    
const flowLocal= addKeyword(EVENTS.ACTION)
    .addAnswer("hola")    
const flowConsultas = addKeyword(EVENTS.ACTION)
    .addAnswer("PUEDES HACER TUS CONSULTAS PERSONALIZADAS LLAMANDO AL SIGUIENTE NUMERO", {
        delay: 8000,
    })
    .addAnswer("+51 907 146 212" , {
        delay: 8600,
    })



const menuFlow = addKeyword(['OP','Op','op']).addAnswer(
    menu,
    {capture: true},
    async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
        if (!["1","2","3","4","5","0"].includes(ctx.body))  {
            return fallBack(
                "Respuesta no valida, por favor seleccione una de las opciones"
            );
        }
        switch (ctx.body) {
            case "1":
                return gotoFlow(flowCat);
            case "2":
                return await flowDynamic("🛍️Aqui nos encontra🛍️,           *Centro Comercial Plaza Central, Jr. Andahuaylas 1138 ,Interior 203S*, https://g.co/kgs/qwymftR");
            case "3":
                return gotoFlow(flowConsultas);
            case "4":
                return await flowDynamic("Aqui puede encontrar nuestras redes: 🌠 *TIKTOK* https://www.tiktok.com/@talita.cosmetics");
            case "0":
                return await flowDynamic(
                    "Saliendo.... Puedes volver a ver las opciones escribiendo *OP*"
                );
        }
    }
);


const flowWelcome = addKeyword(EVENTS.WELCOME)
    .addAnswer('Bienvenido ☺️ a *Talita cosmeticos* para saber o visualizar de nuevo las opciones que tenemos escriba *OP* 🤗', {
        delay: 6000,
    })


const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal, menuFlow, flowWelcome, flowConsultas, flowCat, flowLocal, flowRedes])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
