<?php

use App\Models\User;
use Illuminate\Support\Facades\Http;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
*/

pest()->extend(Tests\TestCase::class)
    ->use(Illuminate\Foundation\Testing\RefreshDatabase::class)
    ->in('Feature');

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

/**
 * Set up Http::fake with a default empty cart response (needed for the
 * HandleInertiaRequests middleware's cartItemCount on authenticated routes)
 * plus any test-specific overrides.
 */
function fakeApiResponses(array $overrides = []): void
{
    Http::fake(array_merge([
        'https://api.test/api/cart' => Http::response([
            'data' => [
                'items' => [],
                'totals' => ['subtotal' => 0, 'shipping' => 0, 'total' => 0],
            ],
        ]),
    ], $overrides));
}

/**
 * Create and authenticate a user with API session data.
 */
function authenticatedUser(array $attributes = []): User
{
    $user = User::factory()->create($attributes);

    test()->actingAs($user)
        ->withSession([
            'api_token' => 'test-token',
            'api_user' => $user->toArray(),
        ]);

    return $user;
}

/** Build a fake product array. */
function fakeProduct(array $overrides = []): array
{
    return array_merge([
        'id' => 1,
        'name' => 'Test Product',
        'description' => 'A test product',
        'price' => '100.00',
        'image' => 'https://example.com/image.jpg',
        'category' => [
            'id' => 1,
            'name' => 'Fertilizantes',
            'slug' => 'fertilizantes',
            'description' => null,
            'is_active' => true,
        ],
        'sku' => 'TEST-001',
        'images' => [
            ['id' => 1, 'url' => 'https://example.com/image1.jpg', 'position' => 0],
            ['id' => 2, 'url' => 'https://example.com/image2.jpg', 'position' => 1],
        ],
    ], $overrides);
}

/** Build a fake category array. */
function fakeCategory(array $overrides = []): array
{
    return array_merge([
        'id' => 1,
        'name' => 'Fertilizantes',
        'slug' => 'fertilizantes',
        'description' => null,
        'is_active' => true,
    ], $overrides);
}

/** Build a fake cart API response. */
function fakeCartResponse(array $items = [], array $totals = []): array
{
    return [
        'data' => [
            'items' => $items,
            'totals' => array_merge([
                'subtotal' => 0,
                'shipping' => 0,
                'total' => 0,
            ], $totals),
        ],
    ];
}

/** Build a fake address array. */
function fakeAddress(array $overrides = []): array
{
    return array_merge([
        'id' => 1,
        'label' => 'Casa',
        'name' => 'Juan Pérez',
        'address_line_1' => 'Calle Principal 123',
        'address_line_2' => null,
        'city' => 'Ciudad de México',
        'state' => 'CDMX',
        'postal_code' => '01000',
        'phone' => '5551234567',
        'is_default' => true,
    ], $overrides);
}

/** Build a fake shipping method array. */
function fakeShippingMethod(array $overrides = []): array
{
    return array_merge([
        'id' => 1,
        'name' => 'Envio Estandar',
        'description' => 'Entrega en 5-7 dias habiles',
        'cost' => 99.00,
        'estimated_delivery_days' => 7,
    ], $overrides);
}

/** Build a fake order array. */
function fakeOrder(array $overrides = []): array
{
    return array_merge([
        'id' => 1,
        'status' => 'pending',
        'total' => '500.00',
        'created_at' => '2026-01-15T10:00:00Z',
        'items' => [],
    ], $overrides);
}
