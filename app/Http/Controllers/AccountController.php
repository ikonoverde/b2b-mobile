<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use Illuminate\Http\Client\ConnectionException;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    /**
     * @throws ConnectionException
     */
    public function __invoke(UserService $userService): Response
    {
        $profile = rescue(fn () => $userService->getProfile(), []);

        return Inertia::render('account', [
            'profile' => $profile['data'] ?? $profile,
        ]);
    }
}
