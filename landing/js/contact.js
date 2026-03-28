// ══════════════════════════════════════════════════════
//  CONTACT FORM — EmailJS
// ══════════════════════════════════════════════════════
(function contactForm() {

    const PUBLIC_KEY = 'eyyxEqFXfrR2rRpmH';
    const SERVICE_ID = 'service_ie1koic';
    const TEMPLATE_ADMIN_ID = 'template_ksw967f';
    const TEMPLATE_USER_ID = 'template_lu0liln';

    const form = document.getElementById('contactForm');
    const btnText = document.getElementById('btnText');
    const btnLoading = document.getElementById('btnLoading');
    const successBox = document.getElementById('formSuccess');

    if (!form) return;

    emailjs.init(PUBLIC_KEY);

    document.getElementById('telefono')?.addEventListener('input', e => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const gimnasio = document.getElementById('gimnasio').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const modulo = document.getElementById('modulo').value || 'No especificado';
        const mensaje = document.getElementById('mensaje').value.trim() || 'Sin mensaje adicional';
        const privacidad = document.getElementById('privacidad').checked;

        if (!nombre || !gimnasio || !telefono || !correo)
            return showError('Por favor completa todos los campos obligatorios.');
        if (telefono.length !== 10)
            return showError('El teléfono debe tener exactamente 10 dígitos.');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))
            return showError('Ingresa un correo electrónico válido.');
        if (!privacidad)
            return showError('Debes aceptar el Aviso de Privacidad para continuar.');

        setLoading(true);

        // URL de WhatsApp personalizada
        const wa_url = `https://wa.me/522229160133?text=Hola%2C%20soy%20${encodeURIComponent(nombre)}%20de%20${encodeURIComponent(gimnasio)}%2C%20acabo%20de%20enviar%20mi%20solicitud%20de%20demo%20en%20Go%20Fit`;

        try {
            // 1️⃣ Notificación admin (texto plano, sin cambios)
            await emailjs.send(SERVICE_ID, TEMPLATE_ADMIN_ID, {
                nombre, gimnasio, telefono, correo, modulo, mensaje
            });

            // 2️⃣ Auto-reply usuario — solo variables de texto, el HTML vive en EmailJS
            await emailjs.send(SERVICE_ID, TEMPLATE_USER_ID, {
                correo, nombre, gimnasio, telefono, modulo, wa_url
            });

            showSuccess();
            form.reset();
        } catch (err) {
            console.error('EmailJS error:', err);
            showError('Error al enviar. Intenta de nuevo o contáctanos por WhatsApp.');
        } finally {
            setLoading(false);
        }
    });

    function setLoading(state) {
        btnText.style.display = state ? 'none' : 'inline-flex';
        btnLoading.style.display = state ? 'inline-flex' : 'none';
    }

    function showSuccess() {
        successBox.className = 'form-success is-success';
        successBox.innerHTML = '<i class="fa-solid fa-circle-check"></i> ¡Mensaje enviado con éxito! Te contactaremos pronto.';
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
            successBox.className = 'form-success';
            successBox.innerHTML = '';   // ← limpia el contenido
        }, 6000);
    }

    function showError(msg) {
        successBox.className = 'form-success is-error';
        successBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${msg}`;
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
            successBox.className = 'form-success';
            successBox.innerHTML = '';   // ← limpia el contenido
        }, 5000);
    }

})();