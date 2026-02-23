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
    public function verifySession(string $sessionId): Response
    {
        return $this->apiClient->get('/checkout/verify', ['session_id' => $sessionId]);
    }
}
