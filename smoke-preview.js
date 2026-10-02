// On the local preview only: await (await import('./smoke-preview.js')).checkPreviewForms()
export function checkPreviewForms() {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  assert(['127.0.0.1', 'localhost'].includes(location.hostname), 'Run against the local preview only');
  const before = { url: location.href, local: JSON.stringify(localStorage), session: JSON.stringify(sessionStorage) };
  const forms = [...document.querySelectorAll('.preview-form')];
  assert(forms.length === 2, 'Both preview forms must be present');
  for (const form of forms) {
    const inputs = [...form.querySelectorAll('input')];
    const values = inputs.map(input => input.value);
    const status = form.querySelector('[role="status"]');
    const previousStatus = status.textContent;
    let submissions = 0;
    let prevented = false;
    const observe = event => { submissions++; prevented = event.defaultPrevented; };
    form.addEventListener('submit', observe);
    try {
      inputs.forEach(input => { input.value = ''; });
      form.requestSubmit();
      assert(submissions === 0, 'Empty required fields must block submission');
      ['Preview Check', '9705550100', '2026 Test Vehicle'].forEach((value, i) => { inputs[i].value = value; });
      form.requestSubmit();
      assert(submissions === 1 && prevented, 'Valid preview must cancel native transmission');
      assert(status.textContent.includes('Nothing was sent or saved'), 'Preview must not imply a lead was sent');
      assert(location.href === before.url, 'Preview must not navigate to a success page');
      assert(JSON.stringify(localStorage) === before.local && JSON.stringify(sessionStorage) === before.session, 'Preview must not persist lead data');
    } finally {
      form.removeEventListener('submit', observe);
      inputs.forEach((input, i) => { input.value = values[i]; });
      status.textContent = previousStatus;
    }
  }
  return { forms: forms.length, requiredValidation: true, transmissionCancelled: true, storageUnchanged: true };
}
