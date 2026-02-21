<?php

namespace App\Http\Controllers;

use App\Services\ProductService;
use App\Services\UserService;
use Illuminate\Http\Client\ConnectionException;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * @throws ConnectionException
     */
    public function __invoke(ProductService $productService, UserService $userService): Response
    {
        $featuredProducts = $productService->getFeaturedProducts();
        $profile = rescue(fn () => $userService->getProfile(), []);

        return Inertia::render('dashboard', [
            'featuredProducts' => $featuredProducts['data'] ?? [],
            'profile' => $profile['data'] ?? $profile,
        ]);
    }
}
