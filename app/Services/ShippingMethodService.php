<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;

/**
 * Fetches available shipping methods from the external API.
 */
class ShippingMethodService
{
    public function __construct(private ApiClient $apiClient) {}

    /**
     * @return array<int, array{id: int, name: string, description: string, cost: float, estimated_delivery_days: int}>
     *
     * @throws ConnectionException
     */
    public function getShippingMethods(): array
    {
        return $this->apiClient->get('/shipping-methods')->json('data') ?? [];
    }
}
