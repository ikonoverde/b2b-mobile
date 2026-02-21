<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;

class OrderService
{
    public function __construct(private ApiClient $apiClient) {}

    /**
     * @throws ConnectionException
     */
    public function getOrders(): array
    {
        return $this->apiClient->get('/orders')->json();
    }

    /**
     * @throws ConnectionException
     */
    public function getOrder(int $id): array
    {
        return $this->apiClient->get("/orders/{$id}")->json();
    }
}
