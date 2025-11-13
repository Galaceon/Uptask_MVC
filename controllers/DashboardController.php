<?php

namespace Controllers;

use Model\Proyecto;
use MVC\Router;

class DashboardController {
    public static function index(Router $router) {
        session_start();
        isAuth();
        $alertas = [];

        $router->render('dashboard/index', [
            'titulo' => 'Proyectos',
            'alertas' => $alertas
        ]);
    }


    public static function crear_proyecto(Router $router) {
        session_start();
        isAuth();
        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $proyecto = new Proyecto($_POST);

            // validación
            $alertas = $proyecto->validarProyecto();

        }

        $router->render('dashboard/crear-proyecto', [
            'alertas' => $alertas,
            'titulo' => 'Crear Proyecto'
        ]);
    }


    public static function perfil(Router $router) {
        session_start();
        isAuth();


        $router->render('dashboard/perfil', [
            'titulo' => 'Perfil'
        ]);
    }
}