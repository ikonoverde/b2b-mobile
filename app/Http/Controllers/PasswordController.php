<?php

namespace App\Http\Controllers;

use App\Http\Requests\Account\ChangePasswordRequest;
use App\Services\UserService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordController extends Controller
{
    private const CONNECTION_ERROR = 'No se pudo conectar con el servidor. Intenta de nuevo.';

    public function __construct(private readonly UserService $userService) {}

    /**
     * Display the password change page.
     */
    public function edit(): Response
    {
        return Inertia::render('account/password');
    }

    /**
     * Update the user's password.
     *
     * @throws ValidationException
     */
    public function update(ChangePasswordRequest $request): RedirectResponse
    {
        try {
            $response = $this->userService->changePassword($request->validated());
        } catch (ConnectionException) {
            return back()->withErrors(['password' => self::CONNECTION_ERROR]);
        }

        if ($response->status() === 422) {
            throw ValidationException::withMessages(
                $response->json('errors', ['password' => ['No se pudo cambiar la contraseña.']])
            );
        }

        if (! $response->successful()) {
            return back()->withErrors(['password' => 'No se pudo cambiar la contraseña.']);
        }

        return back()->with('success', 'Contraseña actualizada correctamente.');
    }
}
