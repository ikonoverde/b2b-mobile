<?php

use Illuminate\Support\Facades\Http;

it('shows forgot password page', function () {
    $this->get(route('password.request'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('auth/forgot-password'));
});

it('sends forgot password request to API', function () {
    Http::fake([
        'https://api.test/api/forgot-password' => Http::response(['message' => 'Email sent']),
    ]);

    $this->post(route('password.email'), [
        'email' => 'test@example.com',
    ])
        ->assertRedirect()
        ->assertSessionHas('status', 'sent');
});

it('handles API 422 errors', function () {
    Http::fake([
        'https://api.test/api/forgot-password' => Http::response([
            'errors' => ['email' => ['No encontramos un usuario con ese correo.']],
        ], 422),
    ]);

    $this->post(route('password.email'), [
        'email' => 'unknown@example.com',
    ])->assertSessionHasErrors('email');
});

it('validates email is required', function () {
    $this->post(route('password.email'), [])
        ->assertSessionHasErrors('email');
});

it('validates email format', function () {
    $this->post(route('password.email'), [
        'email' => 'not-an-email',
    ])->assertSessionHasErrors('email');
});

it('redirects authenticated users away', function () {
    authenticatedUser();
    fakeApiResponses();

    $this->get(route('password.request'))->assertRedirect();
});
