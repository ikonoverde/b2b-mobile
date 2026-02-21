<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckoutRequest;
use App\Services\CartService;
use App\Services\CheckoutService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function __construct(
        private readonly CartService $cartService,
        private readonly CheckoutService $checkoutService,
    ) {}

    /**
     * Show the checkout page.
     *
     * @throws ConnectionException
     */
    public function create(): Response
    {
        $cart = $this->cartService->getCart();

        return Inertia::render('checkout', [
            'cart' => $cart['data'] ?? ['items' => [], 'totals' => ['subtotal' => 0, 'shipping' => 0, 'total' => 0]],
        ]);
    }

    /**
     * Process the checkout.
     *
     * @throws ConnectionException
     */
    public function store(CheckoutRequest $request): RedirectResponse
    {
        $response = $this->checkoutService->createOrder([
            'shipping_address' => $request->validated(),
        ]);

        if (! $response->successful()) {
            return back()->withErrors(['checkout' => 'No se pudo procesar el pedido. Intenta de nuevo.']);
        }

        return redirect()->route('orders');
    }
}
