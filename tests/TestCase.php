<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.api.url' => 'https://api.test/api',
            'services.api.base_url' => 'https://api.test',
        ]);
    }
}
