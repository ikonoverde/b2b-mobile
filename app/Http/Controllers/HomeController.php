<?php

namespace App\Http\Controllers;

use App\Services\ProductService;
use Illuminate\Http\Client\ConnectionException;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * @throws ConnectionException
     */
    public function __invoke(ProductService $productService): Response
    {
        $featuredProducts = $productService->getFeaturedProducts();

        return Inertia::render('welcome', [
            'featuredProducts' => $featuredProducts['data'],
        ]);
    }
}
