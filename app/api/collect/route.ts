import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db/";
import { performanceMetrics, errors, consoleEntries, imageIssues, sites, users } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { MonitoringData } from "@/lib/api-types";
import { v4 as uuidv4, validate as isUUID } from "uuid";

const COOKIE_NAME = "webmonitor-tracking";
const COOKIE_EXPIRATION = 10 * 60; 

export async function POST(req: NextRequest) {
  try {
    const body: MonitoringData = await req.json();

    if (!body.siteId) {
      return NextResponse.json({ error: "siteId è richiesto" }, { status: 400 });
    }

    let parsedSiteId = body.siteId.replace("wm_", "");
    if (!isUUID(parsedSiteId)) {
      parsedSiteId = uuidv4(); 
    }

    const cookies = req.cookies.get(COOKIE_NAME);
    if (cookies && cookies.value.includes(parsedSiteId)) {
      console.log(`🚫 Dati già inviati per il sito ${parsedSiteId}, salto l'inserimento.`);
      return NextResponse.json({ success: false, message: "Dati già raccolti di recente" }, { status: 200 });
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

    return response;

  } catch (error) {
    console.error("❌ Errore API /collect:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Recupera tutti i siti dal database
    const allSites = await db.select().from(sites);

    // Formatta i dati per la risposta
    const response = allSites.map(site => ({
      id: site.id,
      slug: site.slug,
      url: site.url,
      monitoringCode: site.monitoringCode,
      status: site.status,
      lastUpdate: site.lastUpdate ? new Date(site.lastUpdate).toISOString() : null,
    }));

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("Errore API /collect/sites:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
