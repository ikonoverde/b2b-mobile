<?php

use Illuminate\Support\Facades\Http;

it('requires authentication', function () {
    $this->get(route('account'))
        ->assertRedirect(route('login'));
});

it('shows account page with profile', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/user' => Http::response([
            'data' => ['name' => 'Juan', 'email' => 'juan@example.com'],
        ]),
    ]);

    $this->get(route('account'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('account')
            ->where('profile.name', 'Juan')
        );
});

it('handles API failure gracefully', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/user' => Http::response([], 500),
    ]);

    $this->get(route('account'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('account'));
});
