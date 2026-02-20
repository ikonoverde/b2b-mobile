<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

class ApiClient
{
    /**
     * @throws ConnectionException
     */
    public function register(array $data): array
    {
        return $this->request()
            ->post('/register', $data)
            ->json();
    }

    /**
     * @throws ConnectionException
     */
    public function login(array $data): array
    {
        return $this->request()
            ->post('/login', $data)
            ->json();
    }

    /**
     * Make an authenticated GET request.
     *
     * @throws ConnectionException
     */
    public function get(string $endpoint): Response
    {
        return $this->authenticated()->get($endpoint);
    }

    /**
     * Create a base request to the API.
     */
    public function request(): PendingRequest
    {
        return Http::baseUrl(config('services.api.url'))
            ->acceptJson();
    }

    /**
     * Create an authenticated request using the session token.
     */
    public function authenticated(): PendingRequest
    {
        return $this->request()
            ->withToken(session('api_token'));
    }
}
