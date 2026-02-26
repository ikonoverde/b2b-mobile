<?php

use Illuminate\Support\Facades\Http;

it('requires authentication for cart page', function () {
    $this->get(route('cart'))
        ->assertRedirect(route('login'));
});

it('shows cart with items', function () {
    authenticatedUser();
    $cartItem = ['id' => 1, 'product_id' => 1, 'name' => 'Test', 'quantity' => 2, 'price' => '100.00'];
    fakeApiResponses([
        'https://api.test/api/cart' => Http::response(
            fakeCartResponse([$cartItem], ['subtotal' => 200, 'shipping' => 50, 'total' => 250])
        ),
    ]);

    $this->get(route('cart'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('cart')
            ->has('cart.items', 1)
        );
});

it('shows empty cart', function () {
    authenticatedUser();
    fakeApiResponses();

    $this->get(route('cart'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('cart')
            ->where('cart.items', [])
        );
});

it('requires authentication to add item', function () {
    $this->post(route('cart.addItem'), ['product_id' => 1, 'quantity' => 1])
        ->assertRedirect(route('login'));
});

it('adds item successfully', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/cart/items' => Http::response(['data' => ['id' => 1]], 201),
    ]);

    $this->post(route('cart.addItem'), [
        'product_id' => 1,
        'quantity' => 2,
    ])->assertRedirect();
});

it('returns errors when add API fails', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/cart/items' => Http::response([], 500),
    ]);

    $this->post(route('cart.addItem'), [
        'product_id' => 1,
        'quantity' => 1,
    ])
        ->assertRedirect()
        ->assertSessionHasErrors('cart');
});

it('validates add item fields', function () {
    authenticatedUser();
    fakeApiResponses();

    $this->post(route('cart.addItem'), [])
        ->assertSessionHasErrors(['product_id', 'quantity']);
});

it('validates quantity minimum', function () {
    authenticatedUser();
    fakeApiResponses();

    $this->post(route('cart.addItem'), [
        'product_id' => 1,
        'quantity' => 0,
    ])->assertSessionHasErrors('quantity');
});

it('updates cart item quantity', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/cart/items/5' => Http::response([], 200),
    ]);

    $this->post(route('cart.updateItem', ['itemId' => 5]), [
        'quantity' => 3,
    ])->assertRedirect();
});

it('returns errors when update API fails', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/cart/items/5' => Http::response([], 500),
    ]);

    $this->post(route('cart.updateItem', ['itemId' => 5]), [
        'quantity' => 3,
    ])
        ->assertRedirect()
        ->assertSessionHasErrors('cart');
});

it('removes cart item', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/cart/items/5' => Http::response([], 200),
    ]);

    $this->delete(route('cart.removeItem', ['itemId' => 5]))
        ->assertRedirect();
});

it('clears entire cart', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/cart' => Http::response([], 200),
    ]);

    $this->delete(route('cart.clear'))
        ->assertRedirect();
});

it('returns errors when clear API fails', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/cart' => Http::response([], 500),
    ]);

    $this->delete(route('cart.clear'))
        ->assertRedirect()
        ->assertSessionHasErrors('cart');
});
