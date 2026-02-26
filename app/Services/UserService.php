<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;

class UserService
{
    public function __construct(private ApiClient $apiClient) {}

    /**
     * @throws ConnectionException
     */
    public function getProfile(): array
    {
        return $this->apiClient->get('/user')->json();
    }

    /**
     * @throws ConnectionException
     */
    public function updateProfile(array $data): Response
    {
        return $this->apiClient->put('/user', $data);
    }

    /**
     * @throws ConnectionException
     */
    public function changePassword(array $data): Response
    {
        return $this->apiClient->put('/password', $data);
    }
}
