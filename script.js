/* Majestic Cut Barbershop — progressive enhancement only.
   The booking form is a plain HTML POST and works fully without JavaScript. */

(function () {
  'use strict';

  var form = document.getElementById('booking-form');
  var pageField = document.getElementById('form-page');
  var successBox = document.getElementById('form-success');
  var errorBox = document.getElementById('form-error');
  var submitBtn = document.getElementById('form-submit');
  var yearEl = document.getElementById('year');

  /* Current year in the footer */
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* Hidden _page field so the visitor is returned to the right page */
  if (pageField) {
    pageField.value = window.location.href;
  }

  /* Don't offer past dates for "Preferred date" */
  var dateField = document.getElementById('f-date');
  if (dateField) {
    var now = new Date();
    var iso = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0');
    dateField.setAttribute('min', iso);
  }

  function showSuccess() {
    if (!successBox) return;
    successBox.hidden = false;
    if (form) form.hidden = true;
    successBox.setAttribute('tabindex', '-1');
    successBox.focus({ preventScroll: true });
  }

  /* Plain (no-JS style) submission returns with ?submitted=1 */
  try {
    if (new URLSearchParams(window.location.search).get('submitted') === '1') {
      showSuccess();
      var card = document.getElementById('book');
      if (card && 'scrollIntoView' in card) {
        card.scrollIntoView({ block: 'center' });
      }
    }
  } catch (e) { /* URLSearchParams unsupported — plain form still works */ }

  if (!form) return;

  function showError(message) {
    if (!errorBox) return;
    errorBox.textContent = message;
    errorBox.hidden = false;
  }

  function clearError() {
    if (!errorBox) return;
    errorBox.hidden = true;
    errorBox.textContent = '';
  }

  var required = ['f-name', 'f-phone', 'f-service'];

  function validate() {
    var firstBad = null;

    required.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var empty = !el.value || !String(el.value).trim();
      el.setAttribute('aria-invalid', empty ? 'true' : 'false');
      if (empty && !firstBad) firstBad = el;
    });

    var email = document.getElementById('f-email');
    if (email && email.value.trim() && email.value.indexOf('@') === -1) {
      email.setAttribute('aria-invalid', 'true');
      if (!firstBad) firstBad = email;
    } else if (email) {
      email.setAttribute('aria-invalid', 'false');
    }

    if (firstBad) {
      showError('Please add your name, phone number and the service you need.');
      firstBad.focus();
      return false;
    }

    clearError();
    return true;
  }

  form.addEventListener('submit', function (event) {
    if (!validate()) {
      event.preventDefault();
      return;
    }

    /* Enhanced submit: same URL, JSON body, includes _page. */
    if (typeof window.fetch !== 'function') return;

    event.preventDefault();

    if (pageField) pageField.value = window.location.href;

    var payload = {};
    new FormData(form).forEach(function (value, key) {
      payload[key] = typeof value === 'string' ? value : String(value);
    });
    payload._page = window.location.href;

    var label = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Request failed');
        return response.json().catch(function () { return { ok: true }; });
      })
      .then(function (data) {
        if (data && data.ok === false) throw new Error('Submission rejected');
        showSuccess();
      })
      .catch(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = label;
        }
        showError('Sorry, that didn’t send. Please try again in a moment.');
      });
  });
})();
