<?php

namespace App\Http\Controllers;

use App\Services\CategoryService;
use App\Services\ProductService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Inertia\ScrollMetadata;

class CatalogController extends Controller
{
    /**
     * @throws ConnectionException
     */
    public function __invoke(
        Request $request,
        ProductService $productService,
        CategoryService $categoryService,
    ): Response {
        $page = (int) $request->query('page', 1);
        $categoryId = $request->query('category_id');
        $sort = $request->query('sort', 'newest');

        $response = $productService->getProducts(
            page: $page,
            perPage: 15,
            categoryId: $categoryId ? [(int) $categoryId] : null,
            sort: $sort,
        );

        $meta = $response['meta'] ?? [];
        $currentPage = $meta['current_page'] ?? 1;
        $lastPage = $meta['last_page'] ?? 1;
        $total = $meta['total'] ?? 0;

        $metadata = new ScrollMetadata(
            pageName: 'page',
            previousPage: $currentPage > 1 ? $currentPage - 1 : null,
            nextPage: $currentPage < $lastPage ? $currentPage + 1 : null,
            currentPage: $currentPage,
        );

        $products = Inertia::scroll(
            ['data' => $response['data'] ?? []],
            wrapper: 'data',
            metadata: $metadata,
        );

        $categories = $categoryService->getCategories();

        return Inertia::render('catalog', [
            'products' => $products,
            'productsTotal' => $total,
            'categories' => $categories['data'] ?? [],
            'selectedCategoryId' => $categoryId ? (int) $categoryId : null,
            'selectedSort' => $sort,
        ]);
    }
}
