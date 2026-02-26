<?php

use Illuminate\Support\Facades\Http;

const PRODUCTS_LIST_URL = 'https://api.test/api/products?*';

function fakeProductsListResponse(array $products = []): array
{
    return [
        'data' => $products,
        'meta' => [
            'current_page' => 1,
            'last_page' => 1,
            'per_page' => 15,
            'total' => count($products),
        ],
    ];
}

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
        PRODUCTS_LIST_URL => Http::response(fakeProductsListResponse()),
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
        PRODUCTS_LIST_URL => Http::response(fakeProductsListResponse()),
    ]);

    $this->get(route('product.show', 42))->assertOk();

    Http::assertSent(
        fn ($request) => str_contains($request->url(), '/products/42')
    );
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
        PRODUCTS_LIST_URL => Http::response(fakeProductsListResponse()),
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

it('passes related products from same category', function () {
    authenticatedUser();
    $relatedProducts = [
        fakeProduct(['id' => 2, 'name' => 'Related A']),
        fakeProduct(['id' => 3, 'name' => 'Related B']),
    ];
    fakeApiResponses([
        'https://api.test/api/products/1' => Http::response([
            'data' => fakeProduct(),
        ]),
        PRODUCTS_LIST_URL => Http::response(fakeProductsListResponse($relatedProducts)),
    ]);

    $this->get(route('product.show', 1))
        ->assertOk()
        ->assertInertia(
            fn ($page) => $page
                ->component('product/show')
                ->has('relatedProducts', 2)
                ->where('relatedProducts.0.name', 'Related A')
                ->where('relatedProducts.1.name', 'Related B')
        );
});

it('excludes current product from related products', function () {
    authenticatedUser();
    $products = [
        fakeProduct(['id' => 1, 'name' => 'Current']),
        fakeProduct(['id' => 2, 'name' => 'Related']),
    ];
    fakeApiResponses([
        'https://api.test/api/products/1' => Http::response([
            'data' => fakeProduct(),
        ]),
        PRODUCTS_LIST_URL => Http::response(fakeProductsListResponse($products)),
    ]);

    $this->get(route('product.show', 1))
        ->assertOk()
        ->assertInertia(
            fn ($page) => $page
                ->component('product/show')
                ->has('relatedProducts', 1)
                ->where('relatedProducts.0.name', 'Related')
        );
});

it('passes empty related products when none exist', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/products/1' => Http::response([
            'data' => fakeProduct(),
        ]),
        PRODUCTS_LIST_URL => Http::response(fakeProductsListResponse()),
    ]);

    $this->get(route('product.show', 1))
        ->assertOk()
        ->assertInertia(
            fn ($page) => $page
                ->component('product/show')
                ->has('relatedProducts', 0)
        );
});
