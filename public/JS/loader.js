function showLoader() {
    const loader = document.getElementById('global-loader');
    if (loader) {
        loader.style.display = 'flex';
    }
}

function hideLoader() {
    const loader = document.getElementById('global-loader');
    if (loader) {
        loader.style.display = 'none';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const method = form.getAttribute('method') || '';
        
        // We only want to target forms that mutate data (Add, Edit, Delete, Login, Signup)
        // These typically use POST (or POST with _method override for PUT/DELETE)
        if (method.toUpperCase() === 'POST') {
            form.addEventListener('submit', (e) => {
                // Ensure the form is valid before showing the loader.
                // This prevents the loader from getting stuck if client-side validation fails.
                if (form.checkValidity()) {
                    showLoader();
                }
            });
        }
    });
});
