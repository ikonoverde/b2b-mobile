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
    public function getProducts(): array
    {
        return $this->apiClient->get('/products')->json();
    }

    /**
     * @throws ConnectionException
     */
    public function getProduct(int $id): array
    {
        return $this->apiClient->get("/products/{$id}")->json();
    }
}
