<?php

namespace App\Auth;

use App\Models\User;
use App\Services\ApiClient;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Validation\ValidationException;

class ApiUserProvider implements UserProvider
{
    public function __construct(private readonly ApiClient $apiClient) {}

    /**
     * Retrieve a user by their unique identifier (from session).
     */
    public function retrieveById($identifier): ?Authenticatable
    {
        $userData = session('api_user');

        if (! $userData || ($userData['id'] ?? null) != $identifier) {
            return null;
        }

        return $this->hydrateUser($userData);
    }

    /**
     * Retrieve a user by credentials — calls the external API to authenticate.
     *
     * @throws ConnectionException
     * @throws ValidationException
     * @throws RequestException
     */
    public function retrieveByCredentials(array $credentials): ?Authenticatable
    {
        if (empty($credentials['email']) || empty($credentials['password'])) {
            return null;
        }

        $response = $this->apiClient->request()
            ->post('/login', [
                ...$credentials,
                'device_name' => 'mobile',
            ]);

        if ($response->status() === 422) {
            throw ValidationException::withMessages(
                $response->json('errors', [])
            );
        }

        $response->throw();

        $data = $response->json();

        session([
            'api_token' => $data['token'],
            'api_user' => $data['user'],
        ]);

        return $this->hydrateUser($data['user']);
    }

    /**
     * Validate credentials — always true because the API already validated
     * during retrieveByCredentials.
     */
    public function validateCredentials(Authenticatable $user, array $credentials): bool
    {
        return true;
    }

    public function retrieveByToken($identifier, $token): ?Authenticatable
    {
        return null;
    }

    public function updateRememberToken(Authenticatable $user, $token): void {}

    public function rehashPasswordIfRequired(Authenticatable $user, array $credentials, bool $force = false): void {}

    /**
     * Hydrate a User model from API user data without persisting to DB.
     */
    protected function hydrateUser(array $data): User
    {
        $user = new User;
        $user->forceFill($data);
        $user->exists = true;

        return $user;
    }
}
