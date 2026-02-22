<?php

namespace App\Http\Controllers;

use App\Services\OrderService;
use Illuminate\Http\Client\ConnectionException;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(private OrderService $orderService) {}

    /**
     * Display the orders listing.
     */
    public function index(): Response
    {
        try {
            $response = $this->orderService->getOrders();
            $orders = $response['data'] ?? $response;
        } catch (ConnectionException) {
            $orders = [];
        }

        return Inertia::render('orders/index', [
            'orders' => $orders,
        ]);
    }
}
