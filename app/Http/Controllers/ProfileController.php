<?php

namespace App\Http\Controllers;

use App\Http\Requests\Account\UpdateProfileRequest;
use App\Services\UserService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    private const CONNECTION_ERROR = 'No se pudo conectar con el servidor. Intenta de nuevo.';

    public function __construct(private readonly UserService $userService) {}

    /**
     * Display the profile editing page.
     */
    public function edit(): Response
    {
        return Inertia::render('account/profile');
    }

    /**
     * Update the user's profile.
     *
     * @throws ValidationException
     */
    public function update(UpdateProfileRequest $request): RedirectResponse
    {
        try {
            $response = $this->userService->updateProfile($request->validated());
        } catch (ConnectionException) {
            return back()->withErrors(['profile' => self::CONNECTION_ERROR]);
        }

        if ($response->status() === 422) {
            throw ValidationException::withMessages(
                $response->json('errors', ['profile' => ['No se pudo actualizar el perfil.']])
            );
        }

        if (! $response->successful()) {
            return back()->withErrors(['profile' => 'No se pudo actualizar el perfil.']);
        }

        $userData = session('api_user', []);
        session(['api_user' => array_merge($userData, $request->validated())]);

        return back()->with('success', 'Perfil actualizado correctamente.');
    }
}
