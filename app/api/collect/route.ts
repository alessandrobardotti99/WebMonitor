import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/";
import { performanceMetrics, errors, consoleEntries, imageIssues, sites, users } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { MonitoringData } from "@/lib/api-types";
import { v4 as uuidv4, validate as isUUID } from "uuid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const COOKIE_NAME = "webmonitor-tracking";
const COOKIE_EXPIRATION = 10 * 60; 

function setCorsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}


export async function POST(req: NextRequest) {
  try {
    const body: MonitoringData = await req.json();

    if (!body.siteId) {
      return setCorsHeaders(NextResponse.json({ error: "siteId è richiesto" }, { status: 400 }));
    }

    let parsedSiteId = body.siteId.replace("wm_", "");
    if (!isUUID(parsedSiteId)) {
      parsedSiteId = uuidv4();
    }

    const cookies = req.cookies.get(COOKIE_NAME);
    if (cookies && cookies.value.includes(parsedSiteId)) {
      console.log(`🚫 Dati già inviati per il sito ${parsedSiteId}, salto l'inserimento.`);
      return setCorsHeaders(NextResponse.json({ success: false, message: "Dati già raccolti di recente" }, { status: 200 }));
    }

    let siteExists = await db.select().from(sites).where(eq(sites.id, parsedSiteId)).limit(1);

    if (siteExists.length === 0) {
      console.log(`🔍 Il sito con ID ${parsedSiteId} non esiste. Creazione di un sito di test...`);

      const testUser = await db.select().from(users).limit(1);
      const userId = testUser.length > 0 ? testUser[0].id : uuidv4();

      await db.insert(sites).values({
        id: parsedSiteId,
        userId: userId,
        slug: `test-${parsedSiteId}`,
        url: body.data.url || "http://localhost:3000",
        monitoringCode: body.siteId,
        status: "warning",
      });

      console.log(`✅ Sito di test creato con ID: ${parsedSiteId}`);
    }

    await db.insert(performanceMetrics).values({
      siteId: parsedSiteId,
      time: new Date(body.timestamp).toISOString(),
      loadTime: body.data.loadTime,
    });

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

    return setCorsHeaders(response);

  } catch (error) {
    console.error("❌ Errore API /collect:", error);
    return setCorsHeaders(NextResponse.json({ error: "Errore interno del server" }, { status: 500 }));
  }
}


export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return setCorsHeaders(NextResponse.json({ error: "Non autorizzato" }, { status: 401 }));
    }

    console.log(`🔍 Recupero solo i siti di proprietà dell'utente: ${session.user.id}`);

    const userSites = await db
      .select()
      .from(sites)
      .where(eq(sites.userId, session.user.id));

    if (userSites.length === 0) {
      return setCorsHeaders(NextResponse.json([], { status: 200 }));
    }

    const response = userSites.map(site => ({
      id: site.id,
      slug: site.slug,
      url: site.url,
      monitoringCode: site.monitoringCode,
      status: site.status,
      lastUpdate: site.lastUpdate ? new Date(site.lastUpdate).toISOString() : null,
    }));

    return setCorsHeaders(NextResponse.json(response, { status: 200 }));

  } catch (error) {
    console.error("❌ Errore API /collect/sites:", error);
    return setCorsHeaders(NextResponse.json({ error: "Errore interno del server" }, { status: 500 }));
  }
}

export async function OPTIONS() {
  return setCorsHeaders(NextResponse.json({}, { status: 200 }));
}

