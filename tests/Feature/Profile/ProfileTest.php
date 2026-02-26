<?php

use Illuminate\Support\Facades\Http;

it('requires authentication for edit page', function () {
    $this->get(route('profile.edit'))
        ->assertRedirect(route('login'));
});

it('shows profile edit page', function () {
    authenticatedUser();
    fakeApiResponses();

    $this->get(route('profile.edit'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('account/profile'));
});

it('updates profile successfully', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/user' => Http::response(['data' => ['name' => 'Updated Name']], 200),
    ]);

    $this->put(route('profile.update'), [
        'name' => 'Updated Name',
        'email' => 'updated@example.com',
        'phone' => '5559876543',
    ])
        ->assertRedirect()
        ->assertSessionHas('success', 'Perfil actualizado correctamente.');

    expect(session('api_user'))->toMatchArray([
        'name' => 'Updated Name',
        'email' => 'updated@example.com',
        'phone' => '5559876543',
    ]);
});

it('handles API 422 validation errors', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/user' => Http::response([
            'errors' => ['email' => ['El correo ya está en uso.']],
        ], 422),
    ]);

    $this->put(route('profile.update'), [
        'name' => 'Test',
        'email' => 'taken@example.com',
        'phone' => '5551234567',
    ])->assertSessionHasErrors('email');
});

it('handles connection failure', function () {
    authenticatedUser();
    Http::fake([
        'https://api.test/api/cart' => Http::response(fakeCartResponse()),
    ]);

    $this->put(route('profile.update'), [
        'name' => 'Test',
        'email' => 'test@example.com',
        'phone' => '5551234567',
    ])
        ->assertRedirect()
        ->assertSessionHasErrors('profile');
});

it('validates required fields', function () {
    authenticatedUser();
    fakeApiResponses();

    $this->put(route('profile.update'), [])
        ->assertSessionHasErrors(['name', 'email', 'phone']);
});
