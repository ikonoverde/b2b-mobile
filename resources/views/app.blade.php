<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased nativephp-safe-area">
        @inertia

        <native:bottom-nav label-visibility="labeled">
            <native:bottom-nav-item
                id="home"
                icon="home"
                label="Inicio"
                url="/"
                :active="request()->routeIs('home') || request()->routeIs('dashboard')"
            />
            <native:bottom-nav-item
                id="catalog"
                icon="grid_view"
                label="Catálogo"
                url="/catalog"
                :active="request()->routeIs('catalog')"
            />
            <native:bottom-nav-item
                id="cart"
                icon="shopping_cart"
                label="Carrito"
                url="/cart"
                :active="request()->routeIs('cart')"
            />
            <native:bottom-nav-item
                id="account"
                icon="person"
                label="Cuenta"
                url="/account"
                :active="request()->routeIs('account')"
            />
        </native:bottom-nav>
    </body>
</html>
