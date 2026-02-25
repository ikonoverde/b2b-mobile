<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;

class AddressService
{
    public function __construct(private ApiClient $apiClient) {}

    /**
     * @throws ConnectionException
     */
    public function getAddresses(): array
    {
        return $this->apiClient->get('/addresses')->json();
    }

    /**
     * @throws ConnectionException
     */
    public function getAddress(int $id): array
    {
        return $this->apiClient->get("/addresses/{$id}")->json();
    }

    /**
     * @throws ConnectionException
     */
    public function createAddress(array $data): Response
    {
        return $this->apiClient->post('/addresses', $data);
    }

    /**
     * @throws ConnectionException
     */
    public function updateAddress(int $id, array $data): Response
    {
        return $this->apiClient->put("/addresses/{$id}", $data);
    }

    /**
     * @throws ConnectionException
     */
    public function deleteAddress(int $id): Response
    {
        return $this->apiClient->delete("/addresses/{$id}");
    }
}
