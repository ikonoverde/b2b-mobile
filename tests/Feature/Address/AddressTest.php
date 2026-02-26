<?php

use Illuminate\Support\Facades\Http;

it('requires authentication for index', function () {
    $this->get(route('addresses.index'))
        ->assertRedirect(route('login'));
});

it('shows addresses page with address data', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/addresses' => Http::response([
            'data' => [fakeAddress()],
        ]),
    ]);

    $this->get(route('addresses.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('account/addresses')
            ->has('addresses', 1)
        );
});

it('handles connection failure on index', function () {
    authenticatedUser();
    Http::fake([
        'https://api.test/api/cart' => Http::response(fakeCartResponse()),
    ]);

    $this->get(route('addresses.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('account/addresses')
            ->where('addresses', [])
        );
});

it('creates address successfully', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/addresses' => Http::response(['data' => fakeAddress()], 201),
    ]);

    $this->post(route('addresses.store'), [
        'label' => 'Casa',
        'name' => 'Juan Pérez',
        'address_line_1' => 'Calle Principal 123',
        'city' => 'Ciudad de México',
        'state' => 'CDMX',
        'postal_code' => '01000',
        'phone' => '5551234567',
        'is_default' => true,
    ])
        ->assertRedirect()
        ->assertSessionHas('success', 'Dirección guardada correctamente.');
});

it('handles API 422 on store', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/addresses' => Http::response([
            'errors' => ['postal_code' => ['El código postal no es válido.']],
        ], 422),
    ]);

    $this->post(route('addresses.store'), [
        'label' => 'Casa',
        'name' => 'Juan',
        'address_line_1' => 'Calle 1',
        'city' => 'CDMX',
        'state' => 'CDMX',
        'postal_code' => 'invalid',
        'phone' => '5551234567',
    ])->assertSessionHasErrors('postal_code');
});

it('handles connection failure on store', function () {
    authenticatedUser();
    Http::fake([
        'https://api.test/api/cart' => Http::response(fakeCartResponse()),
    ]);

    $this->post(route('addresses.store'), [
        'label' => 'Casa',
        'name' => 'Juan',
        'address_line_1' => 'Calle 1',
        'city' => 'CDMX',
        'state' => 'CDMX',
        'postal_code' => '01000',
        'phone' => '5551234567',
    ])
        ->assertRedirect()
        ->assertSessionHasErrors('address');
});

it('validates store required fields', function () {
    authenticatedUser();
    fakeApiResponses();

    $this->post(route('addresses.store'), [])
        ->assertSessionHasErrors(['label', 'name', 'address_line_1', 'city', 'state', 'postal_code', 'phone']);
});

it('updates address successfully', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/addresses/1' => Http::response(['data' => fakeAddress()], 200),
    ]);

    $this->put(route('addresses.update', 1), [
        'label' => 'Oficina',
        'name' => 'Juan Pérez',
        'address_line_1' => 'Calle Nueva 456',
        'city' => 'Guadalajara',
        'state' => 'Jalisco',
        'postal_code' => '44100',
        'phone' => '3331234567',
        'is_default' => false,
    ])
        ->assertRedirect()
        ->assertSessionHas('success', 'Dirección actualizada correctamente.');
});

it('handles API 422 on update', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/addresses/1' => Http::response([
            'errors' => ['phone' => ['El teléfono no es válido.']],
        ], 422),
    ]);

    $this->put(route('addresses.update', 1), [
        'label' => 'Casa',
        'name' => 'Juan',
        'address_line_1' => 'Calle 1',
        'city' => 'CDMX',
        'state' => 'CDMX',
        'postal_code' => '01000',
        'phone' => 'invalid',
    ])->assertSessionHasErrors('phone');
});

it('handles connection failure on update', function () {
    authenticatedUser();
    Http::fake([
        'https://api.test/api/cart' => Http::response(fakeCartResponse()),
    ]);

    $this->put(route('addresses.update', 1), [
        'label' => 'Casa',
        'name' => 'Juan',
        'address_line_1' => 'Calle 1',
        'city' => 'CDMX',
        'state' => 'CDMX',
        'postal_code' => '01000',
        'phone' => '5551234567',
    ])
        ->assertRedirect()
        ->assertSessionHasErrors('address');
});

it('deletes address successfully', function () {
    authenticatedUser();
    fakeApiResponses([
        'https://api.test/api/addresses/1' => Http::response([], 200),
    ]);

    $this->delete(route('addresses.destroy', 1))
        ->assertRedirect()
        ->assertSessionHas('success', 'Dirección eliminada correctamente.');
});

it('handles connection failure on delete', function () {
    authenticatedUser();
    Http::fake([
        'https://api.test/api/cart' => Http::response(fakeCartResponse()),
    ]);

    $this->delete(route('addresses.destroy', 1))
        ->assertRedirect()
        ->assertSessionHasErrors('address');
});
