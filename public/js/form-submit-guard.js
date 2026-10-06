const confirmationDialog = document.getElementById('confirmation-dialog');
const confirmationMessage = document.getElementById('confirmation-dialog-message');
const confirmationCancel = document.getElementById('confirmation-dialog-cancel');
const confirmationAccept = document.getElementById('confirmation-dialog-confirm');
let pendingConfirmationForm = null;
let pendingConfirmationSubmitter = null;

const submitConfirmedForm = (form, submitter) => {
    form.dataset.confirmed = 'true';
    if (submitter) {
        form.requestSubmit(submitter);
    } else {
        form.requestSubmit();
    }
    delete form.dataset.confirmed;
};

document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) {
        return;
    }

    if (form.dataset.confirmed === 'true') {
        delete form.dataset.confirmed;
        return;
    }

    const message = form.dataset.confirmMessage;
    if (!message) {
        return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();

    if (!confirmationDialog || typeof confirmationDialog.showModal !== 'function') {
        if (window.confirm(message)) {
            submitConfirmedForm(form, event.submitter);
        }
        return;
    }

    pendingConfirmationForm = form;
    pendingConfirmationSubmitter = event.submitter;
    confirmationMessage.textContent = message;
    confirmationDialog.showModal();
}, true);

confirmationCancel?.addEventListener('click', () => confirmationDialog.close());
confirmationDialog?.addEventListener('close', () => {
    pendingConfirmationForm = null;
    pendingConfirmationSubmitter = null;
});
confirmationAccept?.addEventListener('click', () => {
    if (!pendingConfirmationForm) {
        return;
    }

    const form = pendingConfirmationForm;
    const submitter = pendingConfirmationSubmitter;
    pendingConfirmationForm = null;
    pendingConfirmationSubmitter = null;
    confirmationDialog.close();
    submitConfirmedForm(form, submitter);
});

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