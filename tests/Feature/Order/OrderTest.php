<?php

use Illuminate\Support\Facades\Http;

it('requires authentication', function () {
    $this->get(route('orders'))
        ->assertRedirect(route('login'));
});

it('shows orders page with order data', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/orders*' => Http::response([
            'data' => [fakeOrder()],
            'meta' => ['current_page' => 1, 'last_page' => 1, 'total' => 1],
        ]),
    ]);

    $this->get(route('orders'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('orders/index')
            ->where('ordersTotal', 1)
        );
});

it('handles connection failure gracefully', function () {
    authenticatedUser();
    Http::fake([
        'https://api.test/api/cart' => Http::response(fakeCartResponse()),
    ]);

    $this->get(route('orders'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('orders/index')
            ->where('ordersTotal', 0)
        );
});
