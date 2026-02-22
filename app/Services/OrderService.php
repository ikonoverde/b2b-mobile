<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;

class OrderService
{
    public function __construct(private ApiClient $apiClient) {}

    /**
     * @throws ConnectionException
     */
    public function getOrders(int $page = 1, int $perPage = 5): array
    {
        return $this->apiClient->get('/orders', [
            'page' => $page,
            'per_page' => $perPage,
        ])->json();
    }

    /**
     * @throws ConnectionException
     */
    public function getOrder(int $id): array
    {
        return $this->apiClient->get("/orders/{$id}")->json();
    }
}
