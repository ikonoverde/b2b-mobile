<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckoutRequest;
use App\Services\CartService;
use App\Services\CheckoutService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
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
     * Process the checkout and return checkout URL for Stripe hosted page.
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
            'success_url' => url('/checkout/success').
                '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => url('/checkout/cancel'),
        ]);

        $emptyCart = [
            'items' => [],
            'totals' => ['subtotal' => 0, 'shipping' => 0, 'total' => 0],
        ];

        if (! $response->successful()) {
            return Inertia::render('checkout', [
                'cart' => $this->cartService->getCart()['data'] ?? $emptyCart,
                'errors' => ['checkout' => 'No se pudo procesar el pedido. Intenta de nuevo.'],
            ]);
        }

        $body = $response->json();
        $order = $body['data'] ?? null;
        $checkoutUrl = $body['checkout_url'] ?? '';
        $sessionId = $body['session_id'] ?? '';

        if ($order) {
            session(['checkout_order_id' => $order['id']]);
        }

        if ($sessionId) {
            session(['checkout_session_id' => $sessionId]);
        }

        $cart = $this->cartService->getCart();

        return Inertia::render('checkout', [
            'cart' => $cart['data'] ?? $emptyCart,
            'checkoutUrl' => $checkoutUrl,
            'order' => $order,
        ]);
    }

    /**
     * Poll endpoint to check payment status.
     *
     * @throws ConnectionException
     */
    public function status(Request $request): JsonResponse
    {
        $sessionId = $request->query(
            'session_id',
            session('checkout_session_id', ''),
        );

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

    /**
     * Browser redirect target after successful Stripe payment.
     */
    public function success(Request $request): View
    {
        $sessionId = $request->query('session_id', '');

        if ($sessionId) {
            session(['checkout_session_id' => $sessionId]);
        }

        return view('checkout-return', [
            'status' => 'success',
            'message' => 'Pago exitoso',
            'description' => 'Puedes volver a la app para ver tu pedido.',
        ]);
    }

    /**
     * Browser redirect target when user cancels Stripe payment.
     */
    public function cancel(): View
    {
        return view('checkout-return', [
            'status' => 'cancel',
            'message' => 'Pago cancelado',
            'description' => 'Vuelve a la app para intentar de nuevo.',
        ]);
    }
}
