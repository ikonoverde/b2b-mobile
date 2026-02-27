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
        'https://api.test/api/categories' => Http::response([
            'data' => [fakeCategory()],
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

it('shows dashboard with categories', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/products/featured' => Http::response(['data' => []]),
        'https://api.test/api/user' => Http::response(['data' => []]),
        'https://api.test/api/categories' => Http::response([
            'data' => [
                fakeCategory(['id' => 1, 'name' => 'Fertilizantes']),
                fakeCategory(['id' => 2, 'name' => 'Semillas', 'slug' => 'semillas']),
            ],
        ]),
    ]);

    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->has('categories', 2)
            ->where('categories.0.name', 'Fertilizantes')
            ->where('categories.1.name', 'Semillas')
        );
});

it('handles profile API failure gracefully', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/products/featured' => Http::response(['data' => []]),
        'https://api.test/api/user' => Http::response([], 500),
        'https://api.test/api/categories' => Http::response(['data' => []]),
    ]);

    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('dashboard'));
});

it('handles categories API failure gracefully', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/products/featured' => Http::response(['data' => []]),
        'https://api.test/api/user' => Http::response(['data' => []]),
        'https://api.test/api/categories' => Http::response([], 500),
    ]);

    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->where('categories', [])
        );
});
