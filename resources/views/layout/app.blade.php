<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link id="favicon" rel="shortcut icon" type="image/png" href=""/>
    <title>Puzzle Game</title>
    <link href="https://fonts.googleapis.com/css2?family=Lato&display=swap" rel="stylesheet">
    @vite('resources/scss/bootstrap.scss')
    @vite('resources/css/fontawesome.css')
    @vite('resources/scss/puzzle.scss')
    @yield('style')
</head>
<body>
@yield('content')
</body>
<script>
    var _url = "{{ url('/') }}";
    var _token = '{!! csrf_token() !!}';
    var _maxLevel = "{!! config('puzzle.puzzle_max_level') !!}";
</script>
@vite('resources/js/app.js')
@yield('javascript')
</html>
