<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;

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
}
