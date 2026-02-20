<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Services\ApiClient;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisterController extends Controller
{
    public function __construct(private readonly ApiClient $apiClient) {}

    /**
     * Show the registration form.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ConnectionException
     * @throws ValidationException
     * @throws RequestException
     */
    public function store(RegisterRequest $request): RedirectResponse
    {
        $response = $this->apiClient->request()
            ->post('/register', $request->validated());

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

        $user = new User;
        $user->forceFill($data['user']);
        $user->exists = true;

        Auth::login($user);

        $request->session()->regenerate();

        return redirect('/');
    }
}
