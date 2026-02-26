<?php

use Illuminate\Support\Facades\Http;

it('requires authentication', function () {
    $this->get(route('password.edit'))
        ->assertRedirect(route('login'));
});

it('shows password change page', function () {
    authenticatedUser();
    fakeApiResponses();

    $this->get(route('password.edit'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('account/password'));
});

it('validates required fields', function () {
    authenticatedUser();
    fakeApiResponses();

    $this->put(route('password.change'), [])
        ->assertSessionHasErrors(['current_password', 'password', 'password_confirmation']);
});

it('validates password minimum length', function () {
    authenticatedUser();
    fakeApiResponses();

    $this->put(route('password.change'), [
        'current_password' => 'oldpass123',
        'password' => 'short',
        'password_confirmation' => 'short',
    ])->assertSessionHasErrors('password');
});

it('validates password confirmation matches', function () {
    authenticatedUser();
    fakeApiResponses();

    $this->put(route('password.change'), [
        'current_password' => 'oldpass123',
        'password' => 'newpassword123',
        'password_confirmation' => 'different123',
    ])->assertSessionHasErrors('password');
});

it('changes password successfully', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/password' => Http::response(['message' => 'Password updated.'], 200),
    ]);

    $this->put(route('password.change'), [
        'current_password' => 'oldpass123',
        'password' => 'newpassword123',
        'password_confirmation' => 'newpassword123',
    ])
        ->assertRedirect()
        ->assertSessionHas('success', 'Contraseña actualizada correctamente.');
});

it('handles wrong current password', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/password' => Http::response([
            'errors' => ['current_password' => ['La contraseña actual es incorrecta.']],
        ], 422),
    ]);

    $this->put(route('password.change'), [
        'current_password' => 'wrongpass',
        'password' => 'newpassword123',
        'password_confirmation' => 'newpassword123',
    ])->assertSessionHasErrors('current_password');
});

it('handles connection failure', function () {
    authenticatedUser();
    Http::fake([
        'https://api.test/api/cart' => Http::response(fakeCartResponse()),
    ]);

    $this->put(route('password.change'), [
        'current_password' => 'oldpass123',
        'password' => 'newpassword123',
        'password_confirmation' => 'newpassword123',
    ])
        ->assertRedirect()
        ->assertSessionHasErrors('password');
});
