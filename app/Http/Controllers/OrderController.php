<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Display the orders listing.
     */
    public function index(): Response
    {
        return Inertia::render('orders/index');
    }
}
