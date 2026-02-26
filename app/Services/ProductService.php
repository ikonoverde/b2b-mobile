<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;

class ProductService
{
    public function __construct(private ApiClient $apiClient) {}

    /**
     * @throws ConnectionException
     */
    public function getFeaturedProducts(): array
    {
        return $this->apiClient->get('/products/featured')->json();
    }

    /**
     * @throws ConnectionException
     */
    public function getProducts(
        int $page = 1,
        int $perPage = 15,
        ?array $categoryId = null,
    ): array {
        $query = ['page' => $page, 'per_page' => $perPage];

        if ($categoryId !== null) {
            $query['category_id'] = $categoryId;
        }

        return $this->apiClient->get('/products', $query)->json();
    }

    /**
     * @throws ConnectionException
     */
    public function getProduct(int $id): array
    {
        return $this->apiClient->get("/products/{$id}")->json();
    }
}
