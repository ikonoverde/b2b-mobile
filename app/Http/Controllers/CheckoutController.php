<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckoutRequest;
use App\Http\Requests\ConfirmPaymentRequest;
use App\Services\CartService;
use App\Services\CheckoutService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
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
     * Process the checkout and return payment data.
     *
     * @throws ConnectionException
     */
    public function store(CheckoutRequest $request): Response
    {
        $validated = $request->validated();

        $response = $this->checkoutService->createOrder([
            'shipping_address' => [
                'street' => $validated['address_line_1'],
                'city' => $validated['city'],
                'state' => $validated['state'],
                'zip' => $validated['postal_code'],
                'country' => 'MX',
            ],
        ]);

        if (! $response->successful()) {
            return Inertia::render('checkout', [
                'cart' => $this->cartService->getCart()['data'] ?? ['items' => [], 'totals' => ['subtotal' => 0, 'shipping' => 0, 'total' => 0]],
                'errors' => ['checkout' => 'No se pudo procesar el pedido. Intenta de nuevo.'],
            ]);
        }

        $body = $response->json();
        Log::info('Checkout API response', ['body' => $body]);
        $cart = $this->cartService->getCart();

        return Inertia::render('checkout', [
            'cart' => $cart['data'] ?? ['items' => [], 'totals' => ['subtotal' => 0, 'shipping' => 0, 'total' => 0]],
            'paymentData' => [
                'client_secret' => $body['client_secret'] ?? '',
                'publishable_key' => $body['publishable_key'] ?? '',
                'order' => $body['data'] ?? null,
            ],
        ]);
    }

    /**
     * Confirm payment after Stripe processes the card.
     *
     * @throws ConnectionException
     */
    public function confirm(ConfirmPaymentRequest $request): JsonResponse
    {
        Log::info('Checkout confirm request', ['data' => $request->all()]);
        $response = $this->checkoutService->confirmPayment($request->validated());

        if (! $response->successful()) {
            return response()->json([
                'error' => 'No se pudo confirmar el pago. Intenta de nuevo.',
            ], 422);
        }

        return response()->json([
            'success' => true,
            'data' => $response->json('data'),
        ]);
    }
}
