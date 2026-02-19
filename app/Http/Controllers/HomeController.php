<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('welcome', [
            'featuredProducts' => [
                [
                    'id' => 1,
                    'name' => 'Jabón Líquido Industrial',
                    'category' => '5L',
                    'price' => '$45,000',
                    'image' => 'https://placehold.co/300x160/D4E5D0/5E7052?text=Producto+1',
                ],
                [
                    'id' => 2,
                    'name' => 'Desengrasante Pro',
                    'category' => '1 Galón',
                    'price' => '$32,000',
                    'image' => 'https://placehold.co/300x160/E8DCC8/8B6F47?text=Producto+2',
                ],
            ],
        ]);
    }
}
