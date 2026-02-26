<?php

use Illuminate\Support\Facades\Http;

it('shows home page with featured products', function () {
    Http::fake([
        'https://api.test/api/products/featured' => Http::response([
            'data' => [fakeProduct(), fakeProduct(['id' => 2])],
        ]),
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('welcome')
            ->has('featuredProducts', 2)
        );
});

it('is accessible without authentication', function () {
    Http::fake([
        'https://api.test/api/products/featured' => Http::response(['data' => []]),
    ]);

    $this->assertGuest();
    $this->get(route('home'))->assertOk();
});
