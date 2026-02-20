<?php

namespace App\Http\Controllers;

use App\Services\ProductService;
use Illuminate\Http\Client\ConnectionException;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    /**
     * @throws ConnectionException
     */
    public function __invoke(ProductService $productService): Response
    {
        $products = $productService->getProducts();

        return Inertia::render('catalog', [
            'products' => $products['data'],
        ]);
    }
}
