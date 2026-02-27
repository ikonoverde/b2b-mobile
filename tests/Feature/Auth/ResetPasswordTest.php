<?php

use Illuminate\Support\Facades\Http;

it('shows reset password page', function () {
    $this->get(route('password.reset'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('auth/reset-password'));
});

it('resets password with valid token', function () {
    Http::fake([
        'https://api.test/api/password/reset/confirm' => Http::response(['message' => 'Password reset successfully']),
    ]);

    $this->post(route('password.update'), [
        'email' => 'test@example.com',
        'token' => 'valid-token-123',
        'password' => 'newpassword123',
        'password_confirmation' => 'newpassword123',
    ])
        ->assertRedirect(route('login'))
        ->assertSessionHas('status', 'password-reset');
});

it('validates required fields', function () {
    $this->post(route('password.update'), [])
        ->assertSessionHasErrors(['email', 'token', 'password']);
});

it('validates email format', function () {
    $this->post(route('password.update'), [
        'email' => 'not-an-email',
        'token' => 'some-token',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ])->assertSessionHasErrors('email');
});

it('validates password minimum length', function () {
    $this->post(route('password.update'), [
        'email' => 'test@example.com',
        'token' => 'some-token',
        'password' => 'short',
        'password_confirmation' => 'short',
    ])->assertSessionHasErrors('password');
});

it('validates password confirmation matches', function () {
    $this->post(route('password.update'), [
        'email' => 'test@example.com',
        'token' => 'some-token',
        'password' => 'password123',
        'password_confirmation' => 'different123',
    ])->assertSessionHasErrors('password');
});

it('handles expired token error from API', function () {
    Http::fake([
        'https://api.test/api/password/reset/confirm' => Http::response([
            'message' => 'El token ha expirado.',
        ], 400),
    ]);

    $this->from(route('password.reset'))
        ->post(route('password.update'), [
            'email' => 'test@example.com',
            'token' => 'expired-token',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ])
        ->assertRedirect()
        ->assertSessionHasErrors(['token' => 'El token ha expirado.']);
});

it('handles invalid token error from API', function () {
    Http::fake([
        'https://api.test/api/password/reset/confirm' => Http::response([
            'message' => 'Token inválido.',
        ], 400),
    ]);

    $this->from(route('password.reset'))
        ->post(route('password.update'), [
            'email' => 'test@example.com',
            'token' => 'invalid-token',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ])
        ->assertRedirect()
        ->assertSessionHasErrors(['token' => 'Token inválido.']);
});

it('handles API 422 validation errors', function () {
    Http::fake([
        'https://api.test/api/password/reset/confirm' => Http::response([
            'errors' => [
                'password' => ['La contraseña es demasiado débil.'],
            ],
        ], 422),
    ]);

    $this->post(route('password.update'), [
        'email' => 'test@example.com',
        'token' => 'some-token',
        'password' => 'weak',
        'password_confirmation' => 'weak',
    ])->assertSessionHasErrors('password');
});

it('handles generic API errors gracefully', function () {
    Http::fake([
        'https://api.test/api/password/reset/confirm' => Http::response('Server Error', 500),
    ]);

    $this->from(route('password.reset'))
        ->post(route('password.update'), [
            'email' => 'test@example.com',
            'token' => 'some-token',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ])
        ->assertRedirect()
        ->assertSessionHasErrors(['token' => 'Ocurrió un error al restablecer la contraseña. Inténtalo de nuevo.']);
});

it('redirects authenticated users away', function () {
    authenticatedUser();
    fakeApiResponses();

    $this->get(route('password.reset'))->assertRedirect();
});
