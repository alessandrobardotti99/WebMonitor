import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/";
import { sites, performanceMetrics, errors, consoleEntries, imageIssues } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Site } from "@/lib/api-types";

export async function GET(req: NextRequest, { params }: { params: { monitoringCode: string } }) {
  try {
    const { monitoringCode } = params;

    // ✅ Verifica se il sito esiste tramite monitoringCode
    const siteData = await db.select().from(sites).where(eq(sites.monitoringCode, monitoringCode)).limit(1);
    if (siteData.length === 0) {
      return NextResponse.json({ error: "Sito non trovato" }, { status: 404 });
    }
    const site = siteData[0];

    // ✅ Recupera le metriche di performance (ultimi dati più recenti)
    const performanceData = await db
      .select()
      .from(performanceMetrics)
      .where(eq(performanceMetrics.siteId, site.id))
      .orderBy(desc(performanceMetrics.createdAt))
      .limit(100);

    // ✅ Recupera gli errori JavaScript
    const jsErrors = await db
      .select()
      .from(errors)
      .where(eq(errors.siteId, site.id))
      .orderBy(desc(errors.timestamp))
      .limit(100);

    // ✅ Recupera i log della console
    const consoleLogs = await db
      .select()
      .from(consoleEntries)
      .where(eq(consoleEntries.siteId, site.id))
      .orderBy(desc(consoleEntries.timestamp))
      .limit(100);

    // ✅ Recupera le problematiche delle immagini
    const imgIssues = await db
      .select()
      .from(imageIssues)
      .where(eq(imageIssues.siteId, site.id))
      .orderBy(desc(imageIssues.createdAt))
      .limit(100);

    // ✅ Costruisce l'oggetto di risposta con i dati formattati
    const response: Site = {
      id: site.id,
      slug: site.slug,
      url: site.url,
      monitoringCode: site.monitoringCode,
      status: site.status,
      lastUpdate: site.lastUpdate ? new Date(site.lastUpdate).toISOString() : null,
      metrics: {
        loadTime: performanceData.length > 0 ? performanceData[0].loadTime : 0,
        errors: jsErrors.map(error => ({
          type: error.type,
          message: error.message,
          filename: error.filename,
          lineNumber: error.lineNumber,
          timestamp: new Date(error.timestamp).toISOString(),
        })),
        consoleEntries: consoleLogs.map(log => ({
          type: log.type as "log" | "info" | "warn" | "error",
          message: log.message,
          timestamp: new Date(log.timestamp).toISOString(),
        })),
        imageIssues: imgIssues.map(issue => ({
          url: issue.url,
          originalSize: typeof issue.originalSize === "string" ? JSON.parse(issue.originalSize) : issue.originalSize,
          displaySize: typeof issue.displaySize === "string" ? JSON.parse(issue.displaySize) : issue.displaySize,
        })),
      },
      performanceData: performanceData.map(entry => ({
        time: new Date(entry.time).toISOString().slice(11, 16),
        loadTime: entry.loadTime,
      })),
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("❌ Errore API /sites/[monitoringCode]:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
