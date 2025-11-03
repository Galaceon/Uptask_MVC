<?php

namespace Controllers;

use MVC\Router;

class LoginController {
    public static function login(Router $router) {

        if($_SERVER['REQUEST_METHOD'] === 'POST') {

        }

        // Render a la vista
        $router->render('auth/login', [
            'titulo' => 'Iniciar Sesión'
        ]);
    }


    public static function logout() {

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            
        }
    }


    public static function crear(Router $router) {
        echo "Desde Crear";

        if($_SERVER['REQUEST_METHOD'] === 'POST') {

        }

        // Render a la vista
        $router->render('auth/crear', [
            'titulo' => 'Crear Cuenta'
        ]);
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
