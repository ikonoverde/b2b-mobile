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
        ?string $sort = null,
    ): array {
        $query = ['page' => $page, 'per_page' => $perPage];

        if ($categoryId !== null) {
            $query['category_id'] = $categoryId;
        }

        if ($sort !== null) {
            $query['sort'] = $sort;
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

    /**
     * Fetch products in the same category, excluding the given product.
     *
     * Requests one extra item to account for filtering out the current product,
     * ensuring up to $limit results are returned.
     *
     * @param  int  $productId  Product to exclude from results
     * @param  int  $categoryId  Category to filter by
     * @param  int  $limit  Maximum number of related products to return
     * @return array<int, array{id: int, name: string, price: float, category_id: int}>
     *
     * @throws ConnectionException
     */
    public function getRelatedProducts(
        int $productId,
        int $categoryId,
        int $limit = 10,
    ): array {
        $response = $this->getProducts(
            page: 1,
            perPage: $limit + 1,
            categoryId: [$categoryId],
        );
        $products = $response['data'] ?? [];

        return array_values(
            array_filter($products, fn (array $p): bool => $p['id'] !== $productId),
        );
    }
}
