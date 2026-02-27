<?php

use Illuminate\Support\Facades\Http;

it('requires authentication for checkout page', function () {
    $this->get(route('checkout'))
        ->assertRedirect(route('login'));
});

it('shows checkout form with cart, saved addresses, and shipping methods', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/addresses' => Http::response([
            'data' => [fakeAddress()],
        ]),
        'https://api.test/api/shipping-methods' => Http::response([
            'data' => [fakeShippingMethod()],
        ]),
    ]);

    $this->get(route('checkout'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('checkout')
            ->has('cart')
            ->has('savedAddresses', 1)
            ->has('shippingMethods', 1)
        );
});

it('handles address connection failure gracefully', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/addresses' => Http::response([], 500),
        'https://api.test/api/shipping-methods' => Http::response([
            'data' => [fakeShippingMethod()],
        ]),
    ]);

    $this->get(route('checkout'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('checkout')
            ->where('savedAddresses', [])
        );
});

it('handles shipping methods connection failure gracefully', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/addresses' => Http::response([
            'data' => [fakeAddress()],
        ]),
        'https://api.test/api/shipping-methods' => Http::response([], 500),
    ]);

    $this->get(route('checkout'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('checkout')
            ->where('shippingMethods', [])
        );
});

it('requires authentication to store checkout', function () {
    $this->post(route('checkout.store'), [])
        ->assertRedirect(route('login'));
});

it('processes checkout and returns checkout URL', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/checkout' => Http::response([
            'data' => ['id' => 1, 'status' => 'pending'],
            'checkout_url' => 'https://checkout.stripe.com/pay/cs_test_abc123xyz',
        ]),
    ]);

    $this->post(route('checkout.store'), [
        'name' => 'Juan Pérez',
        'address_line_1' => 'Calle Principal 123',
        'address_line_2' => null,
        'city' => 'Ciudad de México',
        'state' => 'CDMX',
        'postal_code' => '01000',
        'phone' => '5551234567',
        'shipping_method_id' => 1,
    ])
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('checkout')
            ->has('checkoutUrl')
            ->has('order')
        );
});

it('stores Stripe session ID in session', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/checkout' => Http::response([
            'data' => ['id' => 1],
            'checkout_url' => 'https://checkout.stripe.com/pay/cs_test_abc123xyz',
        ]),
    ]);

    $this->post(route('checkout.store'), [
        'name' => 'Juan',
        'address_line_1' => 'Calle 1',
        'city' => 'CDMX',
        'state' => 'CDMX',
        'postal_code' => '01000',
        'phone' => '5551234567',
        'shipping_method_id' => 1,
    ]);

    expect(session('checkout_session_id'))->toBe('cs_test_abc123xyz');
});

it('handles checkout API failure', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/checkout' => Http::response([], 500),
    ]);

    $this->post(route('checkout.store'), [
        'name' => 'Juan',
        'address_line_1' => 'Calle 1',
        'city' => 'CDMX',
        'state' => 'CDMX',
        'postal_code' => '01000',
        'phone' => '5551234567',
        'shipping_method_id' => 1,
    ])
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('checkout')
            ->has('errors')
        );
});

it('validates checkout fields', function () {
    authenticatedUser();
    fakeApiResponses();

    $this->post(route('checkout.store'), [])
        ->assertSessionHasErrors(['name', 'address_line_1', 'city', 'state', 'postal_code', 'phone', 'shipping_method_id']);
});

it('validates shipping_method_id is required', function () {
    authenticatedUser();
    fakeApiResponses();

    $this->post(route('checkout.store'), [
        'name' => 'Juan',
        'address_line_1' => 'Calle 1',
        'city' => 'CDMX',
        'state' => 'CDMX',
        'postal_code' => '01000',
        'phone' => '5551234567',
    ])
        ->assertSessionHasErrors(['shipping_method_id']);
});

it('passes shipping_method_id to the API', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/checkout' => Http::response([
            'data' => ['id' => 1, 'status' => 'pending'],
            'checkout_url' => 'https://checkout.stripe.com/pay/cs_test_abc123xyz',
        ]),
    ]);

    $this->post(route('checkout.store'), [
        'name' => 'Juan',
        'address_line_1' => 'Calle 1',
        'city' => 'CDMX',
        'state' => 'CDMX',
        'postal_code' => '01000',
        'phone' => '5551234567',
        'shipping_method_id' => 2,
    ]);

    Http::assertSent(fn ($request) => $request->url() === 'https://api.test/api/checkout'
        && $request['shipping_method_id'] === 2
    );
});

it('returns JSON status when session ID exists', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/checkout/verify*' => Http::response([
            'status' => 'complete',
            'payment_status' => 'paid',
        ]),
    ]);

    $this->withSession(['checkout_session_id' => 'cs_test_abc123'])
        ->getJson(route('checkout.status'))
        ->assertOk()
        ->assertJson(['status' => 'complete']);
});

it('returns 400 when no session ID', function () {
    authenticatedUser();
    fakeApiResponses();

    $this->getJson(route('checkout.status'))
        ->assertStatus(400)
        ->assertJson(['status' => 'error']);
});
