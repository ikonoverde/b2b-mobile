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
    public function get(string $endpoint, array $query = []): Response
    {
        return $this->authenticated()->get($endpoint, $query);
    }

    /**
     * Make an authenticated POST request.
     *
     * @throws ConnectionException
     */
    public function post(string $endpoint, array $data = []): Response
    {
        return $this->authenticated()->post($endpoint, $data);
    }

    /**
     * Make an authenticated PUT request.
     *
     * @throws ConnectionException
     */
    public function put(string $endpoint, array $data = []): Response
    {
        return $this->authenticated()->put($endpoint, $data);
    }

    /**
     * Make an authenticated DELETE request.
     *
     * @throws ConnectionException
     */
    public function delete(string $endpoint): Response
    {
        return $this->authenticated()->delete($endpoint);
    }

    /**
     * Send a forgot password request.
     *
     * @throws ConnectionException
     */
    public function forgotPassword(array $data): Response
    {
        return $this->request()->post('/forgot-password', $data);
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
