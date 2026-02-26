<?php

use Illuminate\Support\Facades\Http;

it('requires authentication', function () {
    $this->get(route('dashboard'))
        ->assertRedirect(route('login'));
});

it('shows dashboard with featured products and profile', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/products/featured' => Http::response([
            'data' => [fakeProduct()],
        ]),
        'https://api.test/api/user' => Http::response([
            'data' => ['name' => 'Juan', 'email' => 'juan@example.com'],
        ]),
    ]);

    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->has('featuredProducts', 1)
            ->where('profile.name', 'Juan')
        );
});

it('handles profile API failure gracefully', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/products/featured' => Http::response(['data' => []]),
        'https://api.test/api/user' => Http::response([], 500),
    ]);

    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('dashboard'));
});
