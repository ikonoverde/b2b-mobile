<?php

use Illuminate\Support\Facades\Http;

it('requires authentication to reorder', function () {
    $this->post(route('orders.reorder', ['order' => 1]))
        ->assertRedirect(route('login'));
});

it('reorders successfully and redirects to cart', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/orders/1/reorder' => Http::response([
            'data' => [
                'added' => [
                    ['product_id' => 1, 'product_name' => 'Fertilizante', 'quantity' => 2, 'unit_price' => 100],
                ],
                'unavailable' => [],
                'price_changes' => [],
            ],
        ]),
    ]);

    $this->post(route('orders.reorder', ['order' => 1]))
        ->assertRedirect(route('cart'))
        ->assertSessionHas('status', 'reorder_success');
});

it('flashes unavailable items when some products are out of stock', function () {
    authenticatedUser();
    $unavailable = [
        ['product_id' => 2, 'product_name' => 'Semilla Premium', 'reason' => 'Out of stock'],
    ];

    fakeApiResponses([
        'https://api.test/api/orders/1/reorder' => Http::response([
            'data' => [
                'added' => [],
                'unavailable' => $unavailable,
                'price_changes' => [],
            ],
        ]),
    ]);

    $this->post(route('orders.reorder', ['order' => 1]))
        ->assertRedirect(route('cart'))
        ->assertSessionHas('reorder_unavailable', $unavailable);
});

it('flashes price changes when product prices differ', function () {
    authenticatedUser();
    $priceChanges = [
        ['product_id' => 1, 'product_name' => 'Fertilizante', 'original_price' => 100, 'current_price' => 120],
    ];

    fakeApiResponses([
        'https://api.test/api/orders/1/reorder' => Http::response([
            'data' => [
                'added' => [
                    ['product_id' => 1, 'product_name' => 'Fertilizante', 'quantity' => 2, 'unit_price' => 120],
                ],
                'unavailable' => [],
                'price_changes' => $priceChanges,
            ],
        ]),
    ]);

    $this->post(route('orders.reorder', ['order' => 1]))
        ->assertRedirect(route('cart'))
        ->assertSessionHas('reorder_price_changes', $priceChanges);
});

it('redirects to orders with error when API returns 404', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/orders/999/reorder' => Http::response(['message' => 'Not found'], 404),
    ]);

    $this->post(route('orders.reorder', ['order' => 999]))
        ->assertRedirect(route('orders'))
        ->assertSessionHasErrors('reorder');
});

it('redirects to orders with error when API returns 403', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/orders/1/reorder' => Http::response(['message' => 'Forbidden'], 403),
    ]);

    $this->post(route('orders.reorder', ['order' => 1]))
        ->assertRedirect(route('orders'))
        ->assertSessionHasErrors('reorder');
});
