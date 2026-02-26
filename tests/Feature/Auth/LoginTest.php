<?php

use Illuminate\Support\Facades\Http;

it('shows login page to guests', function () {
    $this->get(route('login'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('auth/login'));
});

it('redirects authenticated users away from login', function () {
    authenticatedUser();
    fakeApiResponses();

    $this->get(route('login'))->assertRedirect();
});

it('logs in with valid credentials via API', function () {
    Http::fake([
        'https://api.test/api/login' => Http::response([
            'token' => 'test-api-token',
            'user' => [
                'id' => 1,
                'name' => 'Test User',
                'email' => 'test@example.com',
            ],
        ]),
    ]);

    $this->post(route('login'), [
        'email' => 'test@example.com',
        'password' => 'password',
    ])->assertRedirect(route('dashboard'));

    $this->assertAuthenticated();
    expect(session('api_token'))->toBe('test-api-token');
});

it('fails with invalid credentials', function () {
    Http::fake([
        'https://api.test/api/login' => Http::response([
            'errors' => ['email' => ['Credenciales inválidas.']],
        ], 422),
    ]);

    $this->post(route('login'), [
        'email' => 'test@example.com',
        'password' => 'wrong-password',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});

it('fails with non-existent email', function () {
    Http::fake([
        'https://api.test/api/login' => Http::response([
            'errors' => ['email' => ['Credenciales inválidas.']],
        ], 422),
    ]);

    $this->post(route('login'), [
        'email' => 'nonexistent@example.com',
        'password' => 'password',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});

it('validates required fields', function () {
    $this->post(route('login'), [])
        ->assertSessionHasErrors(['email', 'password']);
});

it('validates email format', function () {
    $this->post(route('login'), [
        'email' => 'not-an-email',
        'password' => 'password',
    ])->assertSessionHasErrors('email');
});
