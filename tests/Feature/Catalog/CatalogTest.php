<?php

use Illuminate\Support\Facades\Http;

beforeEach(function () {
    Http::fake([
        'https://api.test/api/products*' => Http::response([
            'data' => [fakeProduct()],
            'meta' => ['current_page' => 1, 'last_page' => 1, 'total' => 1],
        ]),
        'https://api.test/api/categories' => Http::response([
            'data' => [['id' => 1, 'name' => 'Categoría 1']],
        ]),
        'https://api.test/api/cart' => Http::response(fakeCartResponse()),
    ]);
});

it('shows catalog page with products and categories', function () {
    $this->get(route('catalog'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('catalog')
            ->has('categories', 1)
            ->has('productsTotal')
            ->has('selectedSort')
            ->has('products')
        );
});

it('passes pagination parameter to API', function () {
    $this->get(route('catalog', ['page' => 2]))->assertOk();

    Http::assertSent(fn ($request) => str_contains($request->url(), 'page=2')
        && str_contains($request->url(), '/products')
    );
});

it('passes category_id filter to API', function () {
    $this->get(route('catalog', ['category_id' => 3]))->assertOk();

    Http::assertSent(fn ($request) => str_contains($request->url(), 'category_id')
        && str_contains($request->url(), '/products')
    );
});

it('passes sort parameter to API', function () {
    $this->get(route('catalog', ['sort' => 'price_asc']))->assertOk();

    Http::assertSent(fn ($request) => str_contains($request->url(), 'sort=price_asc')
        && str_contains($request->url(), '/products')
    );
});

it('defaults selectedSort to newest', function () {
    $this->get(route('catalog'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('selectedSort', 'newest'));
});

it('is accessible to guests', function () {
    $this->assertGuest();
    $this->get(route('catalog'))->assertOk();
});

it('is accessible to authenticated users', function () {
    authenticatedUser();

    $this->get(route('catalog'))->assertOk();
});
