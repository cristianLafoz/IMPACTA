//Importamos la clase validar formulario
import {ValidacionFormulario} from './validacion_formulario.js';

//Declaramos las variables
//Recogemos el id del formulario
const formulario = document.querySelector("#formulario");
//Recogemos el id de la etiqueta contenedora del mensaje de información
const etiquetaContMsg = document.querySelector(".form-2")
//Instanciamos la clase validacionFormulario
const datosFormulario = new ValidacionFormulario(formulario, etiquetaContMsg, "La consulta se ha enviado correctamente.");
//Llamamos al metodo para validar el formulario
datosFormulario.validarFormulario();



