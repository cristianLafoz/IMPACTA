export class ValidacionFormulario{
    /*Le pasamos como parámetros al constructor
        formulario_contenedor - el id del formulario que tendrá todos los datos
        etiquetaContMensaje - el id del último elemento donde aparecera el mensaje de alerta
        mensaje - mensaje que le mostraremos al usuario
    */
    constructor(formulario_contenedor, etiquetaContMensaje, mensaje){
        this.formulario_contenedor = formulario_contenedor;
        this.etiquetaContMensaje = etiquetaContMensaje;
        this.mensaje = mensaje;
    }

    //Obtenemos todos los inputs del formulario
    getValores() {
        let valores = {};
        // Obtiene los valores de los inputs de texto y textarea
        document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea').forEach(input => {
            valores[input.name.trim()] = input.value.trim();
        });
        return valores;
    }

    getValoresradioButton() {
        // Selecciona el radio button que está seleccionado
        let info_radio = document.querySelector('input[name="Resultado"]:checked');

        if (info_radio != null) {
            return info_radio.value; // Devuelve el valor del radio button seleccionado
        }
        return null;
    }

    getValorCheckbox() {
        // Selecciona el checkbox
        let checkbox = document.querySelector('#checkbox-aceptar');
        if (checkbox.checked) {
            return checkbox.value; // Devuelve el valor del checkbox si está seleccionado
        }
        return null;
    }

    validarFormulario(){
        //Iniciamos el valor de resultado en False
        let formCorrecto = false;
        //Al formulario le asignamos el evento submit
        this.formulario_contenedor.addEventListener('submit', e =>{
            e.preventDefault();

            //Obtenemos los valores y los almacenamos
            let valores = this.getValores();

            //Obtenemos el valor del radio_button seleccionado
            let valor_radio_button = this.getValoresradioButton()

            //Obtenemos el valor del checkbox
            let valor_checkBox = this.getValorCheckbox();

            valores["Resultado"] = valor_radio_button;
            valores["Aviso Legal"] = valor_checkBox;

            console.log(valores);

            //Cambiaremos el valor de formCorrecto a true en caso de que todos los valores del objeto valores estén rellenados.
            formCorrecto = Object.values(valores).every(valor => valor);

            //En caso de que esten rellenos, aparecera un mensaje de EXITO
            if(formCorrecto == true){
                e.preventDefault();
                this.mostrarAlerta(this.mensaje, "", this.etiquetaContMensaje);
                //Envio de datos a PHP
                this.enviarDatos(valores);
                //Borrado de los campos del formulario
                this.limpiarFormulario();
            //En caso de que NO esten rellenos, aparecera un mensaje de ERROR
            } else {
                e.preventDefault();
                this.mostrarAlerta("Todos los campos deben estar rellenados.", "Error", this.etiquetaContMensaje);
            }     
        });
    }

    mostrarAlerta(msg, tipoMensaje, etiquetaCont){
        //Verificamos que la alerta no existe, para no duplicarla.
        const existeAlerta = document.querySelector('.alert');
        if(!existeAlerta){
            //Creamos un Div donde isnertaremos el mensaje de error.
            const divMensaje = document.createElement(`div`);
            //Añadimos clases al nuevo Div que hemos creado.
            if(tipoMensaje=="Error"){
                divMensaje.classList.add('alert', 'alert-danger');
            } else{
                divMensaje.classList.add('alert', 'alert-success');
            }
            divMensaje.style.marginTop = "50px";
            //Mensaje de error
            divMensaje.textContent = msg;
            //Lo adjuntamos al div contenedor del textarea, justo despues del boton de submit
            etiquetaCont.appendChild(divMensaje);
            //Al pasar 3 segundos, eliminaremos el mensaje
            setTimeout(() => {
                divMensaje.remove();
            }, 3000);
        }

    }

    limpiarFormulario(){
        document.querySelector("#formulario").reset();
    // const formulario = this.formulario_contenedor;

    // // Limpiar todos los inputs de tipo texto, email, teléfono, y textarea
    // formulario.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea').forEach(input => {
    //     input.value = '';
    // });

    // // Deseleccionar todos los radio buttons y checkboxes
    // formulario.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
    //     input.checked = false;
    // });
    }


    enviarDatos(valores) {
        let formData = new FormData();
    
        //Creamos el objeto formData a partir del objeto valores
        for (let key in valores) {
            if (valores.hasOwnProperty(key)) {
                formData.append(key, valores[key]);
            }
        }
    
        //Muestra el formData por consola para contrastar los valores
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }
    
        //Mandamos la información al PHP, mediante el metodo POST
        fetch('../Modelo/datosFormulario.php', {
            method: "POST",
            body: formData
        })
        //Controlamos la respuesta del servidor
        .then(response => {
            // Verifica si la respuesta es JSON válida
            if (!response.ok) {
                //Si no es valida, el error es capturado por el catch
                throw new Error('Error en la respuesta del servidor');
            }
            //En caso de que este OK, lo controlamos en el siguiente then
            return response.json();
        })
        .then(data => {
            if (data.success) {
                window.location.href = "../Vista/index.html";
            } else {
                console.error('Error al enviar los datos:', data.message);
                alert('Hubo un error al enviar el formulario.');
            }
        })
        .catch(error => {
            console.error('Error en la petición:', error);
            return error.text().then(errorMessage => {
                console.log('Error message from server:', errorMessage);
            });
            alert('Error en la conexión con el servidor.');
        });
    }
    
   
}
