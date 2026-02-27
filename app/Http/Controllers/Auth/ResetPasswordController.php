<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Services\ApiClient;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ResetPasswordController extends Controller
{
    public function __construct(private readonly ApiClient $apiClient) {}

    /**
     * Show the reset password form.
     */
    public function create(): Response
    {
        return Inertia::render('auth/reset-password');
    }

    /**
     * Handle a reset password request.
     *
     * @throws ConnectionException
     * @throws ValidationException
     * @throws RequestException
     */
    public function store(ResetPasswordRequest $request): RedirectResponse
    {
        $response = $this->apiClient->resetPassword($request->validated());

        // Handle 422 validation errors
        if ($response->status() === 422) {
            throw ValidationException::withMessages(
                $response->json('errors', [])
            );
        }

        // Handle 400 for expired/invalid tokens
        if ($response->status() === 400) {
            $error = $response->json('message', 'El enlace de restablecimiento no es válido o ha expirado.');

            return back()
                ->withInput()
                ->withErrors(['token' => $error]);
        }

        // Handle other errors
        if (! $response->successful()) {
            Log::error('Password reset failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return back()
                ->withInput()
                ->withErrors(['token' => 'Ocurrió un error al restablecer la contraseña. Inténtalo de nuevo.']);
        }

        return redirect()->route('login')->with('status', 'password-reset');
    }
}
