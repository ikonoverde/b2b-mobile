<?php

use Illuminate\Support\Facades\Http;

it('requires authentication', function () {
    $this->get(route('product.show', 1))
        ->assertRedirect(route('login'));
});

it('shows product detail page', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/products/1' => Http::response([
            'data' => fakeProduct(),
        ]),
    ]);

    $this->get(route('product.show', 1))
        ->assertOk()
        ->assertInertia(
            fn ($page) => $page
                ->component('product/show')
                ->where('product.name', 'Test Product')
        );
});

it('passes correct product ID to API', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/products/42' => Http::response([
            'data' => fakeProduct(['id' => 42]),
        ]),
    ]);

    $this->get(route('product.show', 42))->assertOk();

    Http::assertSent(fn ($request) => str_contains($request->url(), '/products/42'));
});

it('passes product images to detail page', function () {
    authenticatedUser();
    $images = [
        ['id' => 1, 'url' => 'https://example.com/img1.jpg', 'position' => 0],
        ['id' => 2, 'url' => 'https://example.com/img2.jpg', 'position' => 1],
    ];
    fakeApiResponses([
        'https://api.test/api/products/1' => Http::response([
            'data' => fakeProduct(['images' => $images]),
        ]),
    ]);

    $this->get(route('product.show', 1))
        ->assertOk()
        ->assertInertia(
            fn ($page) => $page
                ->component('product/show')
                ->has('product.images', 2)
                ->where('product.images.0.url', 'https://example.com/img1.jpg')
                ->where('product.images.1.url', 'https://example.com/img2.jpg')
        );
});

it('handles non-existent product', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/products/999' => Http::response(['message' => 'Not Found'], 404),
    ]);

    $this->get(route('product.show', 999))->assertStatus(500);
});
