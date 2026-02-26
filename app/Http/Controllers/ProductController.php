<?php

namespace App\Http\Controllers;

use App\Services\ProductService;
use Illuminate\Http\Client\ConnectionException;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * @throws ConnectionException
     */
    public function show(int $id, ProductService $productService): Response
    {
        $product = $productService->getProduct($id);
        $productData = $product['data'];
        $relatedProducts = $productService->getRelatedProducts(
            $productData['id'],
            $productData['category']['id'],
        );

        return Inertia::render('product/show', [
            'product' => $productData,
            'relatedProducts' => $relatedProducts,
        ]);
    }
}
