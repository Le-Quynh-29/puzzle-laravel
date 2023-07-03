@extends('layout.app')
@section('style')
    @vite('resources/scss/dropzone.scss')
@endsection
@section('content')
    <div class="card text-center card-puzzle border-box">
        <div class="card-header">
            <div class="row">
                <div class="wrapper col-6">
                    <div class="needsclick dropzone p-0 margin-auto"
                         id="upload-image-dropzone">
                        <div class="fallback">
                            <input class="form-control d-none" type="file" name="file_local[]"/>
                        </div>
                    </div>
                </div>
                <div class="wrapper col-6">
                    <button class="icon next margin-auto">
                        <span><i class="fa-solid fa-arrow-right"></i></span>
                    </button>
                </div>
            </div>
        </div>
        <div class="card-body p-0 height-70-vh">
            <div class="row mrl-2">
                @foreach($listImage as $image)
                <div class="col-6 p-2 choose-image" data-path="{{ $image->path }}">
                    <img src="{{ route('puzzle.show.image', $image->path) }}" class="w-100" height="180">
                </div>
                @endforeach
            </div>
        </div>
    </div>
    @component('modal.choose-image')

    @endcomponent
@endsection
@section('javascript')
    @parent
    <script>
        _urlUploadImage = "{{ route('ajax.puzzle.upload.image') }}";
    </script>
    @vite('resources/js/dropzone.js')
    @vite('resources/js/choose-image.js')
@endsection
