function doPost(e) {
  const data = JSON.parse(e.postData.contents || "{}");
  const ss = SpreadsheetApp.openById("1UhYVKzGJkA_QtDwWkpI2oFfTO8-QNgujPbZ7kRdYuVI");
  if (data.action === "saveQuizResult") {
    const sh = ss.getSheetByName("QuizResults") || ss.insertSheet("QuizResults");
    if (sh.getLastRow() === 0) sh.appendRow(["Fecha","Docente","Simulacro","Puntaje","Total","Porcentaje","Feedback"]);
    const p = data.payload;
    sh.appendRow([new Date(), p.docente, p.quizTitle, p.score, p.total, p.percentage, p.feedback]);
  }
  if (data.action === "saveErrorLog") {
    const sh = ss.getSheetByName("ErrorLog") || ss.insertSheet("ErrorLog");
    if (sh.getLastRow() === 0) sh.appendRow(["Fecha","Docente","Pregunta","Respuesta docente","Respuesta correcta","Explicación"]);
    (data.payload || []).forEach(r => sh.appendRow([new Date(), r.docente, r.question, r.selected, r.correct, r.explanation]));
  }
  return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
}