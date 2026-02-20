<?php

namespace App\Http\Controllers;

use App\Http\Requests\Cart\AddCartItemRequest;
use App\Services\ApiClient;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\RedirectResponse;

class CartController extends Controller
{
    /**
     * Add an item to the cart.
     *
     * @throws ConnectionException
     */
    public function addItem(AddCartItemRequest $request, ApiClient $apiClient): RedirectResponse
    {
        $response = $apiClient->authenticated()->post('/cart/items', $request->validated());

        if (! $response->successful()) {
            return back()->withErrors(['cart' => 'No se pudo agregar el producto al carrito.']);
        }

        return back();
    }
}
