<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;

class CartService
{
    public function __construct(private ApiClient $apiClient) {}

    /**
     * @throws ConnectionException
     */
    public function getCart(): array
    {
        return $this->apiClient->get('/cart')->json();
    }

    /**
     * @throws ConnectionException
     */
    public function addItem(array $data): Response
    {
        return $this->apiClient->post('/cart/items', $data);
    }

    /**
     * @throws ConnectionException
     */
    public function updateItem(int $itemId, array $data): Response
    {
        return $this->apiClient->put("/cart/items/{$itemId}", $data);
    }

    /**
     * @throws ConnectionException
     */
    public function removeItem(int $itemId): Response
    {
        return $this->apiClient->delete("/cart/items/{$itemId}");
    }

    /**
     * @throws ConnectionException
     */
    public function clearCart(): Response
    {
        return $this->apiClient->delete('/cart');
    }
}
