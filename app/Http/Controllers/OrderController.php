<?php

namespace App\Http\Controllers;

use App\Services\OrderService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Inertia\ScrollMetadata;

class OrderController extends Controller
{
    public function __construct(private OrderService $orderService) {}

    /**
     * Display the orders listing.
     */
    public function index(Request $request): Response
    {
        try {
            $page = (int) $request->query('page', 1);
            $response = $this->orderService->getOrders(page: $page);

            $meta = $response['meta'] ?? [];
            $currentPage = $meta['current_page'] ?? 1;
            $lastPage = $meta['last_page'] ?? 1;
            $total = $meta['total'] ?? 0;

            $metadata = new ScrollMetadata(
                pageName: 'page',
                previousPage: $currentPage > 1 ? $currentPage - 1 : null,
                nextPage: $currentPage < $lastPage ? $currentPage + 1 : null,
                currentPage: $currentPage,
            );

            $orders = Inertia::scroll(
                ['data' => $response['data'] ?? []],
                wrapper: 'data',
                metadata: $metadata,
            );
        } catch (ConnectionException) {
            $orders = [];
            $total = 0;
        }

        return Inertia::render('orders/index', [
            'orders' => $orders,
            'ordersTotal' => $total,
        ]);
    }

    /**
     * Reorder all items from a previous order into the cart.
     */
    public function reorder(int $order): RedirectResponse
    {
        try {
            $response = $this->orderService->reorder($order);
        } catch (ConnectionException) {
            return redirect()->route('orders')->withErrors(['reorder' => 'No se pudo conectar con el servidor.']);
        }

        if (! $response->successful()) {
            return redirect()->route('orders')->withErrors(['reorder' => 'No se pudo realizar el pedido nuevamente.']);
        }

        $data = $response->json('data', []);

        $unavailable = $data['unavailable'] ?? [];
        $priceChanges = $data['price_changes'] ?? [];

        return redirect()->route('cart')
            ->with('status', 'reorder_success')
            ->with('reorder_unavailable', ! empty($unavailable) ? $unavailable : null)
            ->with('reorder_price_changes', ! empty($priceChanges) ? $priceChanges : null);
    }
}
