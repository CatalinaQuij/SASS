document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registro');
    const btnEnviar = document.getElementById('btn-enviar');

    const touched = {};

    const fields = {
        nombre: {
            input: document.getElementById('nombre'),
            error: document.getElementById('error-nombre'),
            validate: value => {
                if (!value.trim()) return "El nombre es obligatorio.";
                if (value.trim().length < 3) return "Debe tener al menos 3 caracteres.";
                return "";
            }
        },
        email: {
            input: document.getElementById('email'),
            error: document.getElementById('error-email'),
            validate: value => {
                if (!value.trim()) return "El correo es obligatorio.";
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!re.test(value)) return "Correo no válido.";
                return "";
            }
        },
        password: {
            input: document.getElementById('password'),
            error: document.getElementById('error-password'),
            validate: value => {
                if (!value) return "La contraseña es obligatoria.";
                if (value.length < 8) return "Debe tener al menos 8 caracteres.";
                if (!/[A-Z]/.test(value)) return "Debe tener al menos una mayúscula.";
                if (!/\d/.test(value)) return "Debe tener al menos un número.";
                if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) return "Debe tener un carácter especial.";
                return "";
            }
        },
        confirm_password: {
            input: document.getElementById('confirm_password'),
            error: document.getElementById('error-confirm_password'),
            validate: value => {
                const pass = fields.password.input.value;
                if (!value) return "Debe confirmar la contraseña.";
                if (value !== pass) return "Las contraseñas no coinciden.";
                return "";
            }
        },
        fecha_nacimiento: {
            input: document.getElementById('fecha_nacimiento'),
            error: document.getElementById('error-fecha_nacimiento'),
            validate: value => {
                if (!value) return "La fecha de nacimiento es obligatoria.";
                const fecha = new Date(value);
                const hoy = new Date();
                const edad = hoy.getFullYear() - fecha.getFullYear();
                const m = hoy.getMonth() - fecha.getMonth();
                if (
                    edad < 18 ||
                    (edad === 18 && m < 0) ||
                    (edad === 18 && m === 0 && hoy.getDate() < fecha.getDate())
                ) {
                    return "Debes tener al menos 18 años.";
                }
                return "";
            }
        },
        celular: {
            input: document.getElementById('celular'),
            error: document.getElementById('error-celular'),
            validate: value => {
                if (!value.trim()) return "El celular es obligatorio.";
                if (!/^3\d{9}$/.test(value)) return "Debe ser un número celular colombiano válido (10 dígitos, inicia en 3).";
                return "";
            }
        },
        telefono: {
            input: document.getElementById('telefono'),
            error: document.getElementById('error-telefono'),
            validate: value => {
                if (!value) return "";
                if (!/^\d{10,}$/.test(value)) return "Debe tener mínimo 10 dígitos numéricos.";
                return "";
            }
        },
        terminos: {
            input: document.getElementById('terminos'),
            error: document.getElementById('error-terminos'),
            validate: checked => {
                if (!checked) return "Debes aceptar los términos.";
                return "";
            }
        }
    };

    function validateField(field, key) {
        const value = field.input.type === 'checkbox' ? field.input.checked : field.input.value;
        const errorMsg = field.validate(value);
        field.error.textContent = touched[key] ? errorMsg : '';
        // Solo marcar como inválido si el usuario ya interactuó con el campo
        if (touched[key]) {
            if (errorMsg) {
                field.input.classList.add('invalid');
                field.input.classList.remove('valid');
            } else {
                field.input.classList.remove('invalid');
                field.input.classList.add('valid');
            }
        } else {
            field.input.classList.remove('invalid', 'valid');
        }
        return !errorMsg;
    }

    function validateAll() {
        let valid = true;
        for (const key in fields) {
            if (!validateField(fields[key], key)) valid = false;
        }
        btnEnviar.disabled = !valid;
        return valid;
    }

    // Validar en tiempo real y marcar como tocado al primer cambio
    for (const key in fields) {
        const field = fields[key];
        touched[key] = false;
        field.input.addEventListener(
            field.input.type === 'checkbox' ? 'change' : 'input',
            () => {
                touched[key] = true;
                validateField(field, key);
                validateAll();
            }
        );
        // También marcar como tocado al perder el foco
        field.input.addEventListener('blur', () => {
            touched[key] = true;
            validateField(field, key);
            validateAll();
        });
    }

    // Validar todo al cargar (sin marcar campos como tocados)
    validateAll();

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Marcar todos los campos como tocados al intentar enviar
        for (const key in fields) touched[key] = true;
        if (validateAll()) {
            Swal.fire({
                icon: 'success',
                title: '¡Así se hace!',
                text: 'El formulario es válido y fue enviado correctamente.'
            });
            form.reset();
            for (const key in fields) {
                fields[key].input.classList.remove('valid', 'invalid');
                fields[key].error.textContent = '';
                touched[key] = false;
            }
            btnEnviar.disabled = true;
        } else {
            Swal.fire({
                icon: 'error',
                title: '¡No no!',
                text: 'Por favor corrige los errores antes de enviar.'
            });
        }
    });
});
