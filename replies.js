// replies.js - HU014: responder a un comentario de proyecto (hilos).
// Se carga despues de app.js y mejora cada comentario del modal del proyecto.
// No contiene ni imprime credenciales: reutiliza la sesion que ya guarda app.js.
(() => {
  const MAX_LENGTH = 1000;
  const LIST_SELECTOR = '#project-comment-list';
  const SELECTORS = { comment: '.project-comment' };

  const authHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    const session = localStorage.getItem('cf_token');
    if (session) headers.Authorization = `Bearer ${session}`;
    return headers;
  };

  const request = async (path, options = {}) => {
    const response = await fetch(`${window.CODEFORGE_API.admin}${path}`, { ...options, headers: authHeaders() });
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    if (!response.ok) throw new Error(data?.message || `La API respondió ${response.status}.`);
    return data;
  };

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const notify = (message, isError = false) => {
    const toast = document.querySelector('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast show${isError ? ' error' : ''}`;
    setTimeout(() => { toast.className = 'toast'; }, 2600);
  };

  const formatDate = value => value
    ? new Date(value).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })
    : 'Fecha no disponible';

  const commentIdOf = article =>
    article.dataset.commentId || article.querySelector('[data-comment-id]')?.dataset.commentId;

  const renderReply = reply => {
    const item = el('div', 'comment-reply');
    const meta = el('div', 'project-comment-meta');
    meta.append(el('strong', '', reply.username || 'Desarrollador'), el('time', '', formatDate(reply.fechaCreacion)));
    item.append(meta, el('p', '', reply.respuesta));
    return item;
  };

  const enhance = (article, projectId, counts) => {
    const commentId = commentIdOf(article);
    if (!commentId || article.dataset.repliesReady) return;
    article.dataset.repliesReady = 'true';

    const actions = el('div', 'reply-actions');
    const replyButton = el('button', 'btn reply-open', 'Responder');
    replyButton.type = 'button';
    const toggleButton = el('button', 'btn reply-toggle');
    toggleButton.type = 'button';
    const thread = el('div', 'reply-thread');
    thread.hidden = true;
    const formHost = el('div', 'reply-form-host');
    actions.append(replyButton, toggleButton);
    article.append(actions, thread, formHost);

    const base = `/api/v1/projects/${projectId}/comments/${commentId}/replies`;
    const setCount = total => {
      toggleButton.textContent = `${total} ${total === 1 ? 'respuesta' : 'respuestas'}`;
      toggleButton.dataset.total = String(total);
    };
    setCount(counts[commentId] || 0);

    const loadThread = async () => {
      const data = await request(base);
      thread.replaceChildren(...data.respuestas.map(renderReply));
      setCount(data.totalRespuestas);
    };

    toggleButton.addEventListener('click', async () => {
      if (!thread.hidden) { thread.hidden = true; return; }
      try { await loadThread(); thread.hidden = false; } catch (err) { notify(err.message, true); }
    });

    replyButton.addEventListener('click', () => {
      if (formHost.firstChild) return;
      const form = el('form', 'reply-form');
      const input = el('textarea');
      input.maxLength = MAX_LENGTH;
      input.required = true;
      input.setAttribute('aria-label', 'Tu respuesta');
      const hint = el('span', 'helper reply-error');
      hint.setAttribute('role', 'alert');
      const counter = el('span', 'helper', `0 / ${MAX_LENGTH}`);
      const submit = el('button', 'btn primary', 'Publicar respuesta');
      submit.type = 'submit';
      const cancel = el('button', 'btn', 'Cancelar');
      cancel.type = 'button';
      form.append(input, hint, counter, submit, cancel);
      formHost.append(form);
      input.focus();

      input.addEventListener('input', () => { counter.textContent = `${input.value.length} / ${MAX_LENGTH}`; });
      cancel.addEventListener('click', () => formHost.replaceChildren());
      form.addEventListener('submit', async event => {
        event.preventDefault();
        const respuesta = input.value.trim();
        if (!respuesta) { hint.textContent = 'Complete este campo'; return; }
        hint.textContent = '';
        submit.disabled = true;
        try {
          const result = await request(base, { method: 'POST', body: JSON.stringify({ respuesta }) });
          formHost.replaceChildren();
          await loadThread();
          thread.hidden = false;
          notify(result.mensaje);
        } catch (err) {
          hint.textContent = err.message;
        } finally {
          submit.disabled = false;
        }
      });
    });
  };

  const enhanceList = async list => {
    const projectId = list.dataset.projectId;
    if (!projectId) return;
    let counts = {};
    try { counts = await request(`/api/v1/projects/${projectId}/comments/reply-counts`); } catch { /* sin conteos */ }
    list.querySelectorAll(SELECTORS.comment).forEach(article => enhance(article, projectId, counts));
  };

  const enhancePending = () => {
    const list = document.querySelector(LIST_SELECTOR);
    if (list && list.querySelector(`${SELECTORS.comment}:not([data-replies-ready])`)) enhanceList(list);
  };

  new MutationObserver(enhancePending).observe(document.body, { childList: true, subtree: true });
  enhancePending();
})();