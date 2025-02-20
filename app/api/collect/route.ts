import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/";
import { performanceMetrics, errors, consoleEntries, imageIssues, sites, users } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { MonitoringData } from "@/lib/api-types";
import { v4 as uuidv4, validate as isUUID } from "uuid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "drizzle-orm/sql";

const COOKIE_NAME = "webmonitor-tracking";
const COOKIE_EXPIRATION = 10 * 60; 

function setCorsHeaders(response: NextResponse, req: NextRequest) {
  const origin = req.headers.get("origin");

  if (!origin) {
    return response; 
  }

  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Vary", "Origin");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Allow-Credentials", "true");

  return response;
}

export async function POST(req: NextRequest) {
  try {
    const body: MonitoringData = await req.json();

    if (!body.siteId) {
      return setCorsHeaders(NextResponse.json({ error: "siteId è richiesto" }, { status: 400 }), req);
    }

    let parsedSiteId = body.siteId.replace("wm_", "");
    if (!isUUID(parsedSiteId)) {
      parsedSiteId = uuidv4();
    }

    const cookies = req.cookies.get(COOKIE_NAME);
    if (cookies && cookies.value.includes(parsedSiteId)) {
      console.log(`🚫 Dati già inviati per il sito ${parsedSiteId}, salto l'inserimento.`);
      return setCorsHeaders(NextResponse.json({ success: false, message: "Dati già raccolti di recente" }, { status: 200 }), req);
    }

    const siteUrl = body.data.url || "http://localhost:3000";

    let existingSite = await db.select().from(sites).where(eq(sites.monitoringCode, body.siteId)).limit(1);

    if (existingSite.length > 0) {
      console.log(`🔄 Il sito con monitoringCode ${body.siteId} esiste già, aggiornamento...`);

      await db.update(sites)
        .set({
          url: siteUrl,
          lastUpdate: sql`now()`,
        })
        .where(eq(sites.monitoringCode, body.siteId));

      parsedSiteId = existingSite[0].id;
    } else {
      console.log(`🆕 Il sito con monitoringCode ${body.siteId} non esiste, creazione...`);

      const testUser = await db.select().from(users).limit(1);
      const userId = testUser.length > 0 ? testUser[0].id : uuidv4();

      await db.insert(sites).values({
        id: parsedSiteId,
        userId: userId,
        slug: `test-${parsedSiteId}`,
        url: siteUrl,
        monitoringCode: body.siteId,
        status: "warning",
      });

      console.log(`✅ Sito creato con ID: ${parsedSiteId}`);
    }

    // ✅ Inserisci metriche di performance
    await db.insert(performanceMetrics).values({
      siteId: parsedSiteId,
      time: new Date(body.timestamp).toISOString(),
      loadTime: body.data.loadTime,
    });

    // ✅ Inserisci errori JavaScript se presenti
    if (body.data.errors.length > 0) {
      await db.insert(errors).values(
        body.data.errors.map((error) => ({
          siteId: parsedSiteId,
          type: "JS Error",
          message: error.message,
          filename: error.filename,
          lineNumber: error.lineno,
          timestamp: new Date(body.timestamp),
        }))
      );
    }

    // ✅ Inserisci log della console se presenti
    if (body.data.consoleEntries.length > 0) {
      await db.insert(consoleEntries).values(
        body.data.consoleEntries.map((entry) => ({
          siteId: parsedSiteId,
          type: entry.type,
          message: entry.message,
          timestamp: new Date(entry.timestamp),
        }))
      );
    }

    // ✅ Inserisci problemi con le immagini se presenti
    if (body.data.imageIssues.length > 0) {
      await db.insert(imageIssues).values(
        body.data.imageIssues.map((issue) => ({
          siteId: parsedSiteId,
          url: issue.url,
          originalSize: JSON.stringify(issue.originalSize),
          displaySize: JSON.stringify(issue.displaySize),
        }))
      );
    }

    const response = NextResponse.json({ success: true, message: "Dati salvati con successo" }, { status: 201 });

    response.cookies.set(COOKIE_NAME, parsedSiteId, {
      path: "/",
      maxAge: COOKIE_EXPIRATION,
      httpOnly: true,
    });

    return setCorsHeaders(response, req);

  } catch (error) {
    console.error("❌ Errore API /collect:", error);
    return setCorsHeaders(NextResponse.json({ error: "Errore interno del server" }, { status: 500 }), req);
  }
}


export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return setCorsHeaders(NextResponse.json({ error: "Non autorizzato" }, { status: 401 }), req);
    }

    console.log(`🔍 Recupero solo i siti di proprietà dell'utente: ${session.user.id}`);

    const userSites = await db
      .select()
      .from(sites)
      .where(eq(sites.userId, session.user.id));

    if (userSites.length === 0) {
      return setCorsHeaders(NextResponse.json([], { status: 200 }), req);
    }

    const response = userSites.map(site => ({
      id: site.id,
      slug: site.slug,
      url: site.url,
      monitoringCode: site.monitoringCode,
      status: site.status,
      lastUpdate: site.lastUpdate ? new Date(site.lastUpdate).toISOString() : null,
    }));

    return setCorsHeaders(NextResponse.json(response, { status: 200 }), req);
  } catch (error) {
    console.error("❌ Errore API /collect/sites:", error);
    return setCorsHeaders(NextResponse.json({ error: "Errore interno del server" }, { status: 500 }), req);
  }
}


export async function OPTIONS(req: NextRequest) {
  const response = new NextResponse(null, { status: 204 });

  return setCorsHeaders(response, req);
}



