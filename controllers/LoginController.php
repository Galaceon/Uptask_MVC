<?php

namespace Controllers;

class LoginController {
    public static function login() {
        echo "Desde Login";

        if($_SERVER['REQUEST_METHOD'] === 'POST') {

        }
    }


    public static function logout() {

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            
        }
    }

    public static function crear() {
        echo "Desde Crear";

        if($_SERVER['REQUEST_METHOD'] === 'POST') {

        }
    }

    public static function olvide() {
        echo "Desde Olvide";

        if($_SERVER['REQUEST_METHOD'] === 'POST') {

        }
    }

    public static function reestablecer() {
        echo "Desde resta";

        if($_SERVER['REQUEST_METHOD'] === 'POST') {

        }
    }

    public static function mensaje() {
        echo "Desde mensaje";
    }

    public static function confirmar() {
        echo "Desde confirmar";
    }
}
