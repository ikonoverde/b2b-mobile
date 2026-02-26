<?php

it('logs out authenticated user and redirects to home', function () {
    authenticatedUser();
    fakeApiResponses();

    $this->post(route('logout'))
        ->assertRedirect('/');

    $this->assertGuest();
});

it('clears API session data on logout', function () {
    authenticatedUser();
    fakeApiResponses();

    $this->post(route('logout'));

    expect(session()->has('api_token'))->toBeFalse()
        ->and(session()->has('api_user'))->toBeFalse();
});

it('requires authentication', function () {
    $this->post(route('logout'))
        ->assertRedirect(route('login'));
});
