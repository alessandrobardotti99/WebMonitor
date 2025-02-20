import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/";
import { performanceMetrics, errors, consoleEntries, imageIssues, sites, users, resources } from "@/db/schema";
import { eq, inArray, desc } from "drizzle-orm";
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
    console.log(`🕒 Valore loadTime ricevuto: ${body.data.loadTime}`);

    if (!body.siteId) {
      return NextResponse.json({ error: "siteId è richiesto" }, { status: 400 });
    }

    let parsedSiteId = body.siteId.replace("wm_", "");
    if (!isUUID(parsedSiteId)) {
      parsedSiteId = uuidv4();
    }

    let siteUrl = body.data.url?.trim();
    if (!siteUrl) {
      siteUrl = req.headers.get("referer") || req.headers.get("origin") || "http://localhost:3000";
    }

    console.log(`🌍 URL rilevato: ${siteUrl}`);

    // ✅ Controllo se il cookie contiene già il `siteId`
    const cookies = req.cookies.get(COOKIE_NAME);
    if (cookies && cookies.value.includes(parsedSiteId)) {
      console.log(`🚫 Dati già inviati per il sito ${parsedSiteId}, salto l'inserimento.`);
      return NextResponse.json({ success: false, message: "Dati già raccolti di recente" }, { status: 200 });
    }

    const existingSite = await db.select().from(sites).where(eq(sites.monitoringCode, body.siteId)).limit(1);

    if (existingSite.length > 0) {
      await db.update(sites)
        .set({ url: siteUrl, lastUpdate: sql`now()` })
        .where(eq(sites.monitoringCode, body.siteId));

      parsedSiteId = existingSite[0].id;
    } else {
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

      console.log(`✅ Sito creato con ID: ${parsedSiteId} e URL: ${siteUrl}`);
    }

    // ✅ Evita duplicati su metriche di performance
    const existingPerformance = await db
      .select()
      .from(performanceMetrics)
      .where(eq(performanceMetrics.siteId, parsedSiteId))
      .orderBy(desc(performanceMetrics.createdAt))
      .limit(1);

    if (
      existingPerformance.length === 0 ||
      existingPerformance[0].loadTime !== body.data.loadTime
    ) {
      await db.insert(performanceMetrics).values({
        siteId: parsedSiteId,
        time: new Date(body.timestamp).toISOString(),
        loadTime: body.data.loadTime,
      });
    }

    // ✅ Evita duplicati nei log della console
    const existingConsoleEntries = await db
      .select()
      .from(consoleEntries)
      .where(eq(consoleEntries.siteId, parsedSiteId))
      .orderBy(desc(consoleEntries.timestamp))
      .limit(50);

    const uniqueConsoleEntries = body.data.consoleEntries.filter(
      (entry) => !existingConsoleEntries.some((e) => e.message === entry.message && e.type === entry.type)
    );

    if (uniqueConsoleEntries.length > 0) {
      await db.insert(consoleEntries).values(
        uniqueConsoleEntries.map((entry) => ({
          siteId: parsedSiteId,
          type: entry.type,
          message: entry.message,
          timestamp: new Date(entry.timestamp),
        }))
      );
    }

    // ✅ Evita duplicati negli errori JavaScript
    const existingErrors = await db
      .select()
      .from(errors)
      .where(eq(errors.siteId, parsedSiteId))
      .orderBy(desc(errors.timestamp))
      .limit(50);

    const uniqueErrors = body.data.errors.filter(
      (error) => !existingErrors.some((e) => e.message === error.message && e.filename === error.filename)
    );

    if (uniqueErrors.length > 0) {
      await db.insert(errors).values(
        uniqueErrors.map((error) => ({
          siteId: parsedSiteId,
          type: "JS Error",
          message: error.message,
          filename: error.filename,
          lineNumber: error.lineno,
          timestamp: new Date(error.timestamp),
        }))
      );
    }

    // ✅ Evita duplicati nelle immagini con problemi
    const existingImageIssues = await db
      .select()
      .from(imageIssues)
      .where(eq(imageIssues.siteId, parsedSiteId))
      .orderBy(desc(imageIssues.createdAt))
      .limit(50);

    const uniqueImageIssues = body.data.imageIssues.filter(
      (issue) => !existingImageIssues.some((i) => i.url === issue.url)
    );

    if (uniqueImageIssues.length > 0) {
      await db.insert(imageIssues).values(
        uniqueImageIssues.map((issue) => ({
          siteId: parsedSiteId,
          url: issue.url,
          originalSize: JSON.stringify(issue.originalSize),
          displaySize: JSON.stringify(issue.displaySize),
        }))
      );
    }

    // ✅ Evita duplicati nelle risorse caricate
    const existingResources = await db
      .select()
      .from(resources)
      .where(eq(resources.siteId, parsedSiteId))
      .orderBy(desc(resources.createdAt))
      .limit(50);

    const uniqueResources = body.data.resources.filter(
      (resource) => !existingResources.some((r) => r.name === resource.name)
    );

    if (uniqueResources.length > 0) {
      await db.insert(resources).values(
        uniqueResources.map((resource) => ({
          siteId: parsedSiteId,
          name: resource.name,
          type: resource.type,
          duration: resource.duration,
          size: resource.size,
        }))
      );
    }

    // ✅ Salvo il `siteId` nel cookie per evitare doppio invio
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

    // 🚀 Recupera le metriche per ogni sito
    const response = await Promise.all(
      userSites.map(async (site) => {
        // ✅ Recupera le metriche di performance (prendiamo l'ultima registrazione)
        const performanceData = await db
          .select({
            loadTime: performanceMetrics.loadTime,
          })
          .from(performanceMetrics)
          .where(eq(performanceMetrics.siteId, site.id))
          .orderBy(desc(performanceMetrics.createdAt))
          .limit(1);

        const loadTime = performanceData.length > 0 ? performanceData[0].loadTime : null;

        // ✅ Recupera gli errori JavaScript
        const jsErrors = await db
          .select()
          .from(errors)
          .where(eq(errors.siteId, site.id))
          .orderBy(desc(errors.timestamp))
          .limit(10);

        // ✅ Recupera i log della console
        const consoleLogs = await db
          .select()
          .from(consoleEntries)
          .where(eq(consoleEntries.siteId, site.id))
          .orderBy(desc(consoleEntries.timestamp))
          .limit(10);

        // ✅ Recupera i problemi con le immagini
        const imgIssues = await db
          .select()
          .from(imageIssues)
          .where(eq(imageIssues.siteId, site.id))
          .orderBy(desc(imageIssues.createdAt))
          .limit(10);

        return {
          id: site.id,
          slug: site.slug,
          url: site.url,
          monitoringCode: site.monitoringCode,
          status: site.status,
          lastUpdate: site.lastUpdate ? new Date(site.lastUpdate).toISOString() : null,
          metrics: {
            loadTime: loadTime !== null ? loadTime.toFixed(2) : "N/A",
            errors: jsErrors.map(error => ({
              type: error.type,
              message: error.message,
              filename: error.filename,
              lineNumber: error.lineNumber,
              timestamp: new Date(error.timestamp).toISOString(),
            })),
            consoleEntries: consoleLogs.map(log => ({
              type: log.type,
              message: log.message,
              timestamp: new Date(log.timestamp).toISOString(),
            })),
            imageIssues: imgIssues.map(issue => ({
              url: issue.url,
              originalSize: typeof issue.originalSize === "string" ? JSON.parse(issue.originalSize) : issue.originalSize,
              displaySize: typeof issue.displaySize === "string" ? JSON.parse(issue.displaySize) : issue.displaySize,
            })),
          },
        };
      })
    );

    console.log("📤 Response API /collect:", JSON.stringify(response, null, 2));

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



