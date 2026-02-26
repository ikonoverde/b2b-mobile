<?php

it('shows terms page', function () {
    $this->get(route('terms'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('terms'));
});

it('shows privacy page', function () {
    $this->get(route('privacy'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('privacy'));
});
