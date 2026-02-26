<?php

use Illuminate\Support\Facades\Http;

it('shows registration page to guests', function () {
    $this->get(route('register'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('auth/register'));
});

it('redirects authenticated users away', function () {
    authenticatedUser();
    fakeApiResponses();

    $this->get(route('register'))->assertRedirect();
});

it('registers via API successfully', function () {
    fakeApiResponses([
        'https://api.test/api/register' => Http::response([
            'token' => 'test-api-token',
            'user' => [
                'id' => 1,
                'name' => 'Test Business',
                'email' => 'test@example.com',
            ],
        ]),
    ]);

    $this->post(route('register'), [
        'name' => 'Test Business',
        'rfc' => 'XAXX010101000',
        'email' => 'test@example.com',
        'phone' => '5551234567',
        'password' => 'password123',
        'device_name' => 'test-device',
        'terms_accepted' => true,
    ])->assertRedirect(route('dashboard'));

    expect(session('api_token'))->toBe('test-api-token')
        ->and(session('api_user'))->toHaveKey('name', 'Test Business');
});

it('handles API 422 validation errors', function () {
    fakeApiResponses([
        'https://api.test/api/register' => Http::response([
            'errors' => ['email' => ['El correo electrónico ya está registrado.']],
        ], 422),
    ]);

    $this->post(route('register'), [
        'name' => 'Test Business',
        'rfc' => 'XAXX010101000',
        'email' => 'taken@example.com',
        'phone' => '5551234567',
        'password' => 'password123',
        'device_name' => 'test-device',
        'terms_accepted' => true,
    ])->assertSessionHasErrors('email');
});

it('validates required fields', function () {
    $this->post(route('register'), [])
        ->assertSessionHasErrors(['name', 'rfc', 'email', 'phone', 'password', 'device_name', 'terms_accepted']);
});

it('validates RFC format', function () {
    $this->post(route('register'), [
        'name' => 'Test',
        'rfc' => 'invalid-rfc',
        'email' => 'test@example.com',
        'phone' => '5551234567',
        'password' => 'password123',
        'device_name' => 'test',
        'terms_accepted' => true,
    ])->assertSessionHasErrors('rfc');
});

it('validates password minimum length', function () {
    $this->post(route('register'), [
        'name' => 'Test',
        'rfc' => 'XAXX010101000',
        'email' => 'test@example.com',
        'phone' => '5551234567',
        'password' => 'short',
        'device_name' => 'test',
        'terms_accepted' => true,
    ])->assertSessionHasErrors('password');
});

it('validates terms must be accepted', function () {
    $this->post(route('register'), [
        'name' => 'Test',
        'rfc' => 'XAXX010101000',
        'email' => 'test@example.com',
        'phone' => '5551234567',
        'password' => 'password123',
        'device_name' => 'test',
        'terms_accepted' => false,
    ])->assertSessionHasErrors('terms_accepted');
});
