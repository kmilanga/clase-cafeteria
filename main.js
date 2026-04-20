document.addEventListener('DOMContentLoaded', () => {

    /* =============================================
       1. Navbar — efecto scroll
    ============================================= */
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }


    /* =============================================
       2. CTA flotante — ocultar al llegar al footer
    ============================================= */
    const ctaFlotante = document.querySelector('.cta-flotante');
    const footer = document.querySelector('.footer');

    if (ctaFlotante && footer) {
        const observerFooter = new IntersectionObserver(
            ([entry]) => {
                ctaFlotante.style.opacity = entry.isIntersecting ? '0' : '1';
                ctaFlotante.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
            },
            { threshold: 0.1 }
        );
        observerFooter.observe(footer);
    }


    /* =============================================
       3. Formulario de contacto — validación + envío
       Usa Formspree (sin backend). Cambia ACTION_URL
       por tu endpoint de formspree.io o similar.
    ============================================= */
    const ACTION_URL = 'https://formspree.io/f/TU_ID_AQUI';

    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Limpiar errores previos
            clearErrors();

            const nombre = form.nombre.value.trim();
            const email = form.email.value.trim();
            const mensaje = form.mensaje.value.trim();
            let valid = true;

            // Validaciones
            if (!nombre || nombre.length < 2) {
                markInvalid(form.nombre, 'Introduce tu nombre (mín. 2 caracteres).');
                valid = false;
            }

            if (!email || !isValidEmail(email)) {
                markInvalid(form.email, 'Introduce un email válido.');
                valid = false;
            }

            if (!mensaje || mensaje.length < 10) {
                markInvalid(form.mensaje, 'El mensaje debe tener al menos 10 caracteres.');
                valid = false;
            }

            if (!valid) {
                setFeedback('Por favor corrige los campos indicados.', 'error');
                return;
            }

            // Estado de carga
            const submitBtn = form.querySelector('[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando…';

            try {
                const res = await fetch(ACTION_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({ nombre, email, mensaje }),
                });

                if (res.ok) {
                    setFeedback('✓ Mensaje enviado. ¡Gracias, te respondemos pronto!', 'success');
                    form.reset();
                } else {
                    throw new Error('Error del servidor');
                }
            } catch {
                setFeedback('No se pudo enviar el mensaje. Inténtalo de nuevo o llámanos directamente.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="bx bx-send" aria-hidden="true"></i> Enviar mensaje';
            }
        });
    }

    function markInvalid(field, msg) {
        field.classList.add('invalid');
        field.setAttribute('aria-describedby', field.id + '-error');

        const err = document.createElement('span');
        err.id = field.id + '-error';
        err.className = 'field-error';
        err.style.cssText = 'color:#c0392b;font-size:1.3rem;margin-top:0.3rem;display:block';
        err.textContent = msg;
        field.parentNode.appendChild(err);

        // Limpia el error al escribir
        field.addEventListener('input', () => {
            field.classList.remove('invalid');
            const existingErr = document.getElementById(field.id + '-error');
            if (existingErr) existingErr.remove();
        }, { once: true });
    }

    function clearErrors() {
        form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
        form.querySelectorAll('.field-error').forEach(el => el.remove());
        setFeedback('', '');
    }

    function setFeedback(msg, type) {
        if (!feedback) return;
        feedback.textContent = msg;
        feedback.className = 'form-feedback ' + type;
    }

    function isValidEmail(val) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    }


    /* =============================================
       4. Animación de entrada para tarjetas
       (Intersection Observer — sin librería)
    ============================================= */
    const animatedEls = document.querySelectorAll(
        '.best-sellers-item, .testimonio-card, .menu-item'
    );

    if ('IntersectionObserver' in window && animatedEls.length) {
        animatedEls.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        animatedEls.forEach(el => observer.observe(el));
    }

});
