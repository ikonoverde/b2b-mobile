<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;

class CategoryService
{
    public function __construct(private ApiClient $apiClient) {}

    /**
     * @throws ConnectionException
     */
    public function getCategories(): array
    {
        return $this->apiClient->get('/categories')->json();
    }
}
