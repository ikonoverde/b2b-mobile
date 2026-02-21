<?php

namespace App\Http\Controllers;

use App\Http\Requests\Cart\AddCartItemRequest;
use App\Http\Requests\Cart\UpdateCartItemRequest;
use App\Services\CartService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function __construct(private readonly CartService $cartService) {}

    /**
     * Display the cart page.
     *
     * @throws ConnectionException
     */
    public function index(): Response
    {
        $cart = $this->cartService->getCart();

        return Inertia::render('cart', [
            'cart' => $cart['data'] ?? ['items' => [], 'totals' => ['subtotal' => 0, 'shipping' => 0, 'total' => 0]],
        ]);
    }

    /**
     * Add an item to the cart.
     *
     * @throws ConnectionException
     */
    public function addItem(AddCartItemRequest $request): RedirectResponse
    {
        $response = $this->cartService->addItem($request->validated());

        if (! $response->successful()) {
            return back()->withErrors(['cart' => 'No se pudo agregar el producto al carrito.']);
        }

        return back();
    }

    /**
     * Update a cart item's quantity.
     *
     * @throws ConnectionException
     */
    public function updateItem(int $itemId, UpdateCartItemRequest $request): RedirectResponse
    {
        $response = $this->cartService->updateItem($itemId, $request->validated());

        if (! $response->successful()) {
            return back()->withErrors(['cart' => 'No se pudo actualizar la cantidad.']);
        }

        return back();
    }

    /**
     * Remove an item from the cart.
     *
     * @throws ConnectionException
     */
    public function removeItem(int $itemId): RedirectResponse
    {
        $response = $this->cartService->removeItem($itemId);

        if (! $response->successful()) {
            return back()->withErrors(['cart' => 'No se pudo eliminar el producto.']);
        }

        return back();
    }

    /**
     * Clear the entire cart.
     *
     * @throws ConnectionException
     */
    public function clear(): RedirectResponse
    {
        $response = $this->cartService->clearCart();

        if (! $response->successful()) {
            return back()->withErrors(['cart' => 'No se pudo vaciar el carrito.']);
        }

        return back();
    }
}
