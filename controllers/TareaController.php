<?php

namespace Controllers;

use MVC\Router;

class TareaController {

    public static function index() {

    }

    public static function crear() {
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $array = [
                'respuesta' => true,
                'nombre' => 'Anto'
            ];

            echo json_encode($array);
        }
    }

    public static function actualizar() {
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            
        }
    }

    public static function eliminar() {
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            
        }
    }
}