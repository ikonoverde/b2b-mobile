<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $message }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8faf7;
            padding: 24px;
        }
        .card {
            text-align: center;
            max-width: 380px;
            width: 100%;
        }
        .icon {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 36px;
        }
        .icon-success { background: rgba(94, 112, 82, 0.1); }
        .icon-cancel { background: rgba(239, 68, 68, 0.1); }
        h1 {
            font-size: 22px;
            font-weight: 700;
            color: #5E7052;
            margin-bottom: 8px;
        }
        p {
            font-size: 15px;
            color: #6b7280;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="icon {{ $status === 'success' ? 'icon-success' : 'icon-cancel' }}">
            @if($status === 'success')
                &#10003;
            @else
                &#10007;
            @endif
        </div>
        <h1>{{ $message }}</h1>
        <p>{{ $description }}</p>
    </div>
</body>
</html>
