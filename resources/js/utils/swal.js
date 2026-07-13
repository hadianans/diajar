import Swal from 'sweetalert2';

/**
 * Pre-configured SweetAlert2 instance with Material Design styling
 * that matches the Diajar LMS design system.
 */

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    },
    customClass: {
        popup: 'swal-toast-popup',
    }
});

/**
 * Show a success toast notification (top-right, auto-dismiss).
 */
export function showSuccess(title, text = '') {
    return Toast.fire({
        icon: 'success',
        title,
        text,
    });
}

/**
 * Show an error alert dialog.
 */
export function showError(title, text = '') {
    return Swal.fire({
        icon: 'error',
        title,
        text,
        confirmButtonText: 'OK',
        customClass: {
            confirmButton: 'swal-btn-primary',
        },
    });
}

/**
 * Show a warning alert dialog.
 */
export function showWarning(title, text = '') {
    return Swal.fire({
        icon: 'warning',
        title,
        text,
        confirmButtonText: 'OK',
        customClass: {
            confirmButton: 'swal-btn-primary',
        },
    });
}

/**
 * Show an informational alert dialog.
 */
export function showInfo(title, text = '') {
    return Swal.fire({
        icon: 'info',
        title,
        text,
        confirmButtonText: 'OK',
        customClass: {
            confirmButton: 'swal-btn-primary',
        },
    });
}

/**
 * Show a destructive confirmation dialog (for delete actions).
 * Returns a promise that resolves to `true` if confirmed, `false` otherwise.
 */
export async function confirmDelete(title = 'Are you sure?', text = 'This action cannot be undone.') {
    const result = await Swal.fire({
        icon: 'warning',
        title,
        text,
        showCancelButton: true,
        confirmButtonText: 'Yes, delete',
        cancelButtonText: 'Cancel',
        customClass: {
            confirmButton: 'swal-btn-danger',
            cancelButton: 'swal-btn-cancel',
        },
        reverseButtons: true,
    });
    return result.isConfirmed;
}

/**
 * Show a non-destructive confirmation dialog (for general actions).
 * Returns a promise that resolves to `true` if confirmed, `false` otherwise.
 */
export async function confirmAction(title, text = '') {
    const result = await Swal.fire({
        icon: 'question',
        title,
        text,
        showCancelButton: true,
        confirmButtonText: 'Yes, proceed',
        cancelButtonText: 'Cancel',
        customClass: {
            confirmButton: 'swal-btn-primary',
            cancelButton: 'swal-btn-cancel',
        },
        reverseButtons: true,
    });
    return result.isConfirmed;
}

/**
 * Show a text input prompt dialog.
 * Returns the input value if confirmed, or `null` if cancelled.
 */
export async function promptInput(title, { inputLabel = '', inputPlaceholder = '', inputValue = '', inputType = 'text' } = {}) {
    const result = await Swal.fire({
        title,
        input: inputType,
        inputLabel,
        inputPlaceholder,
        inputValue,
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        customClass: {
            confirmButton: 'swal-btn-primary',
            cancelButton: 'swal-btn-cancel',
            input: 'swal-input-field',
        },
        reverseButtons: true,
        inputValidator: (value) => {
            if (!value || value.trim() === '') {
                return 'Please enter a value.';
            }
        },
    });
    return result.isConfirmed ? result.value : null;
}

export default Swal;
