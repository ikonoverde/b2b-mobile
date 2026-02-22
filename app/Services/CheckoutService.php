<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;

class CheckoutService
{
    public function __construct(private ApiClient $apiClient) {}

    /**
     * @throws ConnectionException
     */
    public function createOrder(array $data): Response
    {
        return $this->apiClient->post('/checkout', $data);
    }

    /**
     * @throws ConnectionException
     */
    public function confirmPayment(array $data): Response
    {
        return $this->apiClient->post('/checkout/confirm', $data);
    }
}
