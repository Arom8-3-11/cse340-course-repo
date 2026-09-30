document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) {
        return;
    }

    if (form.dataset.submitLocked === 'true') {
        event.preventDefault();
        return;
    }

    form.dataset.submitLocked = 'true';
    form.setAttribute('aria-busy', 'true');

    form.querySelectorAll('button[type="submit"], button:not([type]), input[type="submit"]').forEach((button) => {
        button.disabled = true;
        button.dataset.submitGuardDisabled = 'true';
    });
});

window.addEventListener('pageshow', () => {
    document.querySelectorAll('form[data-submit-locked="true"]').forEach((form) => {
        delete form.dataset.submitLocked;
        form.removeAttribute('aria-busy');

        form.querySelectorAll('[data-submit-guard-disabled="true"]').forEach((button) => {
            button.disabled = false;
            delete button.dataset.submitGuardDisabled;
        });
    });
});