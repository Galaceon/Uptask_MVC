<?php

namespace Controllers;

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


        $router->render('dashboard/crear-proyecto', [
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