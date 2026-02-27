<?php

namespace App\Http\Controllers;

use App\Services\ProductService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * @throws ConnectionException
     */
    public function __invoke(ProductService $productService): Response|RedirectResponse
    {
        if (auth()->check()) {
            return redirect(route('dashboard'));
        }

        $featuredProducts = $productService->getFeaturedProducts();

        return Inertia::render('welcome', [
            'featuredProducts' => $featuredProducts['data'],
        ]);
    }
}
