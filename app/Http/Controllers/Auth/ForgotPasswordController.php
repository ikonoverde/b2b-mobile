<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Services\ApiClient;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ForgotPasswordController extends Controller
{
    public function __construct(private readonly ApiClient $apiClient) {}

    /**
     * Show the forgot password form.
     */
    public function create(): Response
    {
        return Inertia::render('auth/forgot-password');
    }

    /**
     * Handle a forgot password request.
     *
     * @throws ConnectionException
     * @throws ValidationException
     * @throws RequestException
     */
    public function store(ForgotPasswordRequest $request): RedirectResponse
    {
        $response = $this->apiClient->forgotPassword($request->validated());

        if ($response->status() === 422) {
            throw ValidationException::withMessages(
                $response->json('errors', [])
            );
        }

        $response->throw();

        return back()->with('status', 'sent');
    }
}
