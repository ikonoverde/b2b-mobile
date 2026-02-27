<?php

namespace App\Http\Controllers;

use App\Services\CategoryService;
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
    public function __invoke(
        ProductService $productService,
        UserService $userService,
        CategoryService $categoryService,
    ): Response {
        $featuredProducts = $productService->getFeaturedProducts();
        $profile = rescue(fn () => $userService->getProfile(), []);
        $categories = rescue(fn () => $categoryService->getCategories(), []);

        return Inertia::render('dashboard', [
            'featuredProducts' => $featuredProducts['data'] ?? [],
            'profile' => $profile['data'] ?? $profile,
            'categories' => $categories['data'] ?? $categories,
        ]);
    }
}
