<?php

namespace App\Http\Controllers;

use App\Http\Requests\Address\StoreAddressRequest;
use App\Http\Requests\Address\UpdateAddressRequest;
use App\Services\AddressService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AddressController extends Controller
{
    private const CONNECTION_ERROR = 'No se pudo conectar con el servidor. Intenta de nuevo.';

    public function __construct(private readonly AddressService $addressService) {}

    /**
     * Display the saved addresses page.
     */
    public function index(): Response
    {
        try {
            $result = $this->addressService->getAddresses();
            $addresses = $result['data'] ?? [];
        } catch (ConnectionException) {
            $addresses = [];
        }

        return Inertia::render('account/addresses', [
            'addresses' => $addresses,
        ]);
    }

    /**
     * Store a new address.
     *
     * @throws ValidationException
     */
    public function store(StoreAddressRequest $request): RedirectResponse
    {
        try {
            $response = $this->addressService->createAddress($request->validated());
        } catch (ConnectionException) {
            return back()->withErrors(['address' => self::CONNECTION_ERROR]);
        }

        if ($response->status() === 422) {
            throw ValidationException::withMessages(
                $response->json('errors', ['address' => ['No se pudo guardar la dirección.']])
            );
        }

        if (! $response->successful()) {
            return back()->withErrors(['address' => 'No se pudo guardar la dirección.']);
        }

        return back()->with('success', 'Dirección guardada correctamente.');
    }

    /**
     * Update an existing address.
     *
     * @throws ValidationException
     */
    public function update(UpdateAddressRequest $request, int $address): RedirectResponse
    {
        try {
            $response = $this->addressService->updateAddress($address, $request->validated());
        } catch (ConnectionException) {
            return back()->withErrors(['address' => self::CONNECTION_ERROR]);
        }

        if ($response->status() === 422) {
            throw ValidationException::withMessages(
                $response->json('errors', ['address' => ['No se pudo actualizar la dirección.']])
            );
        }

        if (! $response->successful()) {
            return back()->withErrors(['address' => 'No se pudo actualizar la dirección.']);
        }

        return back()->with('success', 'Dirección actualizada correctamente.');
    }

    /**
     * Delete an address.
     */
    public function destroy(int $address): RedirectResponse
    {
        try {
            $response = $this->addressService->deleteAddress($address);
        } catch (ConnectionException) {
            return back()->withErrors(['address' => self::CONNECTION_ERROR]);
        }

        if (! $response->successful()) {
            return back()->withErrors(['address' => 'No se pudo eliminar la dirección.']);
        }

        return back()->with('success', 'Dirección eliminada correctamente.');
    }
}
