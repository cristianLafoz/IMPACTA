<?php


    require "../../PHPMailer/src/Exception.php";
    require "../../PHPMailer/src/PHPMailer.php";
    require "../../PHPMailer/src/SMTP.php";

    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    use PHPMailer\PHPMailer\SMTP; 


    class envioEmail {
        //Funcion para enviar email cuando se realice una consulta.
        public function contactaMail($Email, $Nombre, $Mensaje, $Titulo_Consulta = "Mensaje automatico a su consulta - IMPACTA"){
            //Instanciamos clase PHP_Mailer
            $oMail= new PHPMailer();
            $oMail->isSMTP();
            //El host que vamos a utilizar es el de gmail
            $oMail->Host="smtp.gmail.com";
            //Puerto para el envío de correo en modo seguro
            $oMail->Port=587;
            //Protocolo de seguridad tls / ssl
            $oMail->SMTPSecure="tls";
            $oMail->SMTPAuth=true;
            //Usuario de google desde el que se enviará el correo
            $oMail->Username="rest.pacheco1@gmail.com";
            //Contraseña generada por gmail verificación en dos pasos
            $oMail->Password="sjgqmfmqxttcqayj";
            //Enviado desde y titulo mensaje
            $oMail->setFrom("rest.pacheco1@gmail.com", "No responder a este mensaje");
            //La dirección destino, el email que pondrá el usuario
            $oMail->addAddress($Email);
            //El titulo del email será el título de la consulta
            $oMail->Subject=$Titulo_Consulta;
            //Cuerpo del mensaje
            $oMail->msgHTML("Hola " . $Nombre . "<br>Su consulta ha sido recibida.<br><br>" . '"' . $Mensaje . '"' . "<br><br>En breves nos pondremos en contacto con usted.<br><br>Un saludo.<br>Dirección Impacta Comunicacion.");
            //En caso de error
            if(!$oMail->send()){
                throw new Exception("Error al enviar el correo: " . $oMail->ErrorInfo);
            }

        }


    }

?>