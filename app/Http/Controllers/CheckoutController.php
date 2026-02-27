<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckoutRequest;
use App\Services\AddressService;
use App\Services\CartService;
use App\Services\CheckoutService;
use App\Services\ShippingMethodService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function __construct(
        private readonly AddressService $addressService,
        private readonly CartService $cartService,
        private readonly CheckoutService $checkoutService,
        private readonly ShippingMethodService $shippingMethodService,
    ) {}

    /**
     * Show the checkout page.
     *
     * @throws ConnectionException
     */
    public function create(): Response
    {
        $cart = $this->cartService->getCart();

        try {
            $savedAddresses = $this->addressService->getAddresses()['data'] ?? [];
        } catch (ConnectionException) {
            $savedAddresses = [];
        }

        try {
            $shippingMethods = $this->shippingMethodService->getShippingMethods();
        } catch (ConnectionException) {
            $shippingMethods = [];
        }

        return Inertia::render('checkout', [
            'cart' => $cart['data'] ?? ['items' => [], 'totals' => ['subtotal' => 0, 'shipping' => 0, 'total' => 0]],
            'savedAddresses' => $savedAddresses,
            'shippingMethods' => $shippingMethods,
        ]);
    }

    /**
     * Process the checkout and return checkout URL for Stripe hosted page.
     *
     * @throws ConnectionException
     */
    public function store(CheckoutRequest $request): Response
    {
        $validated = $request->validated();

        $apiBaseUrl = config('services.api.base_url');

        $response = $this->checkoutService->createOrder([
            'shipping_address' => [
                'street' => $validated['address_line_1'],
                'city' => $validated['city'],
                'state' => $validated['state'],
                'zip' => $validated['postal_code'],
                'country' => 'MX',
            ],
            'shipping_method_id' => $validated['shipping_method_id'],
            'success_url' => $apiBaseUrl.
                '/checkout/success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => $apiBaseUrl.'/checkout/cancel',
        ]);

        $emptyCart = [
            'items' => [],
            'totals' => ['subtotal' => 0, 'shipping' => 0, 'total' => 0],
        ];

        if (! $response->successful()) {
            return Inertia::render('checkout', [
                'cart' => $this->cartService->getCart()['data'] ?? $emptyCart,
                'savedAddresses' => [],
                'errors' => ['checkout' => 'No se pudo procesar el pedido. Intenta de nuevo.'],
            ]);
        }

        $body = $response->json();
        Log::info('Checkout API response', ['body' => $body]);
        $order = $body['data'] ?? null;
        $checkoutUrl = $body['checkout_url'] ?? '';

        // Extract Stripe session ID from checkout URL
        $sessionId = '';
        if (preg_match('/cs_(test|live)_[a-zA-Z0-9]+/', $checkoutUrl, $matches)) {
            $sessionId = $matches[0];
        }

        if ($sessionId) {
            session(['checkout_session_id' => $sessionId]);
        }

        $cart = $this->cartService->getCart();

        return Inertia::render('checkout', [
            'cart' => $cart['data'] ?? $emptyCart,
            'savedAddresses' => [],
            'checkoutUrl' => $checkoutUrl,
            'order' => $order,
        ]);
    }

    /**
     * Proxy to API's checkout verify endpoint (requires auth token).
     *
     * @throws ConnectionException
     */
    public function status(): JsonResponse
    {
        $sessionId = session('checkout_session_id', '');

        if (! $sessionId) {
            return response()->json([
                'status' => 'error',
                'message' => 'No session ID found.',
            ], 400);
        }

        $response = $this->checkoutService->verifySession($sessionId);

        if (! $response->successful()) {
            return response()->json(['status' => 'pending']);
        }

        return response()->json($response->json());
    }
}
