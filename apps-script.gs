// ID de la hoja de cálculo donde se guardan los resultados
const SHEET_ID = "1UhYVKzGJkA_QtDwWkpI2oFfTO8-QNgujPbZ7kRdYuVI";

/**
 * Permite verificar rápidamente, desde el navegador, que el Web App
 * está desplegado y accesible. Abrir la URL del exec directamente
 * debe mostrar { ok: true, status: "Apps Script activo" }.
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, status: "Apps Script activo" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // evita que dos envíos simultáneos se pisen

    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: "Solicitud sin cuerpo (postData)." });
    }

    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);

    if (data.action === "saveQuizResult") {
      const p = data.payload || {};
      const sh = ss.getSheetByName("QuizResults") || ss.insertSheet("QuizResults");
      if (sh.getLastRow() === 0) {
        sh.appendRow(["Fecha", "Docente", "Simulacro", "Puntaje", "Total", "Porcentaje", "Feedback"]);
      }
      sh.appendRow([
        new Date(),
        p.docente || "",
        p.quizTitle || "",
        p.score || 0,
        p.total || 0,
        p.percentage || 0,
        p.feedback || ""
      ]);
      return jsonResponse({ ok: true, action: "saveQuizResult" });
    }

    if (data.action === "saveErrorLog") {
      const sh = ss.getSheetByName("ErrorLog") || ss.insertSheet("ErrorLog");
      if (sh.getLastRow() === 0) {
        sh.appendRow(["Fecha", "Docente", "Pregunta", "Respuesta docente", "Respuesta correcta", "Explicación"]);
      }
      (data.payload || []).forEach(r => {
        sh.appendRow([new Date(), r.docente || "", r.question || "", r.selected || "", r.correct || "", r.explanation || ""]);
      });
      return jsonResponse({ ok: true, action: "saveErrorLog" });
    }

    return jsonResponse({ ok: false, error: "Acción no reconocida: " + data.action });

  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
