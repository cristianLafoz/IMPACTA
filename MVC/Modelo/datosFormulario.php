<?php

//Establecemos los accesos
header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type");
//Espeecificamos que el contenido de respuesta sea de tipo JSON para la respuesta al JS
header('Content-Type: application/json; charset=UTF-8');

//Instanciamos envio_email.php para mandar correo
require_once("./envio_email.php");


//Identificamos el metodo de acceso, para que unicamente sea POST
if ($_SERVER['REQUEST_METHOD'] == "POST") {

    // Obtenemos los datos enviados desde el formulario
    //En caso de que no exista los datos enviados por POST, pondremos un valor vacío
    $nombre = isset($_POST['Nombre']) ? trim($_POST['Nombre']) : '';
    $email = isset($_POST['Email']) ? trim($_POST['Email']) : '';
    $telefono = isset($_POST['Telefono']) ? trim($_POST['Telefono']) : '';
    $planeta = isset($_POST['Planeta_de_nacimiento']) ? trim($_POST['Planeta_de_nacimiento']) : '';
    $mensaje = isset($_POST['Mensaje']) ? trim($_POST['Mensaje']) : '';
    $resultado = isset($_POST['Resultado']) ? trim($_POST['Resultado']) : '';
    $aviso_legal = isset($_POST['Aviso_Legal']) ? trim($_POST['Aviso_Legal']) : '';

    // validamos que todas las variables existan
    if (empty($nombre) || empty($email) || empty($telefono) || empty($planeta) || empty($mensaje) || empty($resultado) || empty($aviso_legal) ) {
        //En caso de que alguno este vacio saltara el mensaje
        echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios"]);
        exit;
    }

    // Conectar con la base de datos usando MySQLi y consultas preparadas
    $conexion = new mysqli('localhost', 'root', '', 'impacta');

    //En caso de que la conexion de error, enviamos un json de vuelta indicando el error
    if ($conexion->connect_error) {
        echo json_encode(["success" => false, "message" => "Conexión fallida: " . $conexion->connect_error]);
        exit;
    } 

    // Consulta para evitar inyecciones SQL
    $stmt = $conexion->prepare("INSERT INTO datos_formulario (Nombre, Email, Telefono, Planeta_de_nacimiento, Mensaje, Resultado, Aviso_Legal) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssss", $nombre, $email, $telefono, $planeta, $mensaje, $resultado, $aviso_legal);

    // Ejecutar la consulta y verificar el resultado
    if ($stmt->execute()) {
        try {
            // En caso de que todo salga bien, envía correo de confirmación al usuario
            $nuevo_email = new envioEmail;
            $nuevo_email->contactaMail($email, $nombre, $mensaje, "Mensaje automático a su consulta - IMPACTA");

            echo json_encode(["success" => true, "message" => "Datos insertados correctamente y correo enviado"]);

        } catch (Exception $e) {

            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Error al insertar los datos: " . $stmt->error]);
    }

    // Cerrar la declaración y la conexión
    $stmt->close();
    $conexion->close();

    //En caso de que el metodo no sea POST
} else {
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
}
?>
