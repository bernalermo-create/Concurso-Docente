
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx8kP0YY2hBF7eg6OVvrW1NrIz2iraUrKoZ9PCgfhKJNwUhGTGD1rrZoz9eNXZVlOpQDg/exec";
const SHEET_ID = "1UhYVKzGJkA_QtDwWkpI2oFfTO8-QNgujPbZ7kRdYuVI";
const modules = [
  "Constitución, fines de la educación y marco normativo",
  "Didáctica, evaluación formativa y planeación de aula",
  "Desarrollo infantil, inclusión y convivencia escolar",
  "Competencias lectoras, matemáticas y resolución de casos pedagógicos"
];
const quiz = [
  {
    q: "La evaluación formativa se caracteriza principalmente por:",
    options: ["Asignar una nota final", "Acompañar el aprendizaje con retroalimentación", "Comparar estudiantes", "Aplicar solo pruebas escritas"],
    answer: 1,
    explanation: "La evaluación formativa busca recoger evidencias para ajustar la enseñanza y ofrecer retroalimentación útil."
  },
  {
    q: "En primaria, una adaptación razonable favorece principalmente:",
    options: ["Reducir contenidos sin criterio", "Garantizar acceso y participación del estudiante", "Evitar evaluar", "Separar al estudiante del grupo"],
    answer: 1,
    explanation: "Las adaptaciones razonables apuntan a la participación, permanencia y aprendizaje en condiciones de equidad."
  },
  {
    q: "Una secuencia didáctica robusta debería incluir:",
    options: ["Inicio, desarrollo, cierre y criterios de evaluación", "Solo actividades lúdicas", "Solo examen final", "Solo trabajo individual"],
    answer: 0,
    explanation: "La planeación requiere propósito, actividades, evidencias y criterios claros."
  }
];

function renderModules() {
  document.getElementById('modules').innerHTML = modules.map(m => `<li>${m}</li>`).join('');
}
function renderQuiz() {
  const el = document.getElementById('quiz');
  el.innerHTML = quiz.map((item, i) => `
    <div class="q">
      <strong>${i+1}. ${item.q}</strong>
      ${item.options.map((op,j)=>`<label style="display:block;margin-top:8px"><input type="radio" name="q${i}" value="${j}"> ${op}</label>`).join('')}
    </div>`).join('');
}
function getTeacher() {
  return JSON.parse(localStorage.getItem('bootcampTeacherProfile') || 'null');
}
document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('teacherName').value.trim();
  if (!name) return;
  localStorage.setItem('bootcampTeacherProfile', JSON.stringify({name}));
  document.getElementById('welcome').textContent = `Docente activo: ${name}`;
});
const existing = getTeacher();
if (existing) document.getElementById('welcome').textContent = `Docente activo: ${existing.name}`;

document.getElementById('submitQuiz').addEventListener('click', async () => {
  const teacher = getTeacher();
  if (!teacher?.name) {
    alert('Primero ingresa el nombre del docente.');
    return;
  }
  let correct = 0;
  const incorrectItems = [];
  quiz.forEach((item, i) => {
    const checked = document.querySelector(`input[name="q${i}"]:checked`);
    const selected = checked ? Number(checked.value) : null;
    if (selected === item.answer) correct++;
    else incorrectItems.push({
      docente: teacher.name,
      question: item.q,
      selected: selected === null ? "Sin respuesta" : item.options[selected],
      correct: item.options[item.answer],
      explanation: item.explanation
    });
  });
  const total = quiz.length;
  const percentage = Math.round((correct / total) * 100);
  const feedback = percentage >= 80 ? "Buen dominio." : percentage >= 60 ? "Vas bien, pero conviene reforzar algunos temas." : "Conviene reforzar fundamentos pedagógicos y práctica con casos.";
  document.getElementById('result').innerHTML = `
    <div class="feedback">
      <p><strong>Resultado:</strong> ${correct}/${total} (${percentage}%)</p>
      <p>${feedback}</p>
      <h4>Retroalimentación</h4>
      <ul>${incorrectItems.map(x => `<li><strong>${x.question}</strong><br>Tu respuesta: ${x.selected}<br>Correcta: ${x.correct}<br>${x.explanation}</li>`).join('') || '<li>Sin errores en este intento.</li>'}</ul>
    </div>`;

  const payload = {
    action: "saveQuizResult",
    payload: {
      docente: teacher.name,
      quizTitle: "Simulacro inicial primaria",
      score: correct,
      total,
      percentage,
      feedback,
      timestamp: new Date().toISOString(),
      sheetId: SHEET_ID
    }
  };
  try {
    await fetch(WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    if (incorrectItems.length) {
      await fetch(WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "saveErrorLog", payload: incorrectItems, sheetId: SHEET_ID })
      });
    }
  } catch (e) {
    console.error(e);
  }
});
renderModules(); renderQuiz();
