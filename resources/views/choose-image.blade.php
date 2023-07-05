@extends('layout.app')
@section('style')
    @vite('resources/scss/dropzone.scss')
    @vite('resources/scss/toastr.scss')
@endsection
@section('content')
    <div class="card text-center card-puzzle border-box">
        <div class="card-header">
            <div class="row">
                <div class="wrapper col-12 flex-end">
                    <div class="needsclick dropzone p-0"
                         id="upload-image-dropzone">
                        <div class="fallback">
                            <input class="form-control d-none" type="file" name="file_local[]"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-body p-0 height-70-vh">
            <div class="row mrl-2" id="list-image">
                @foreach($listImage as $image)
                    <div class="col-6 p-2 choose-image" data-path="{{ $image->path }}" data-width="{{ $image->width }}"
                         data-height="{{ $image->height }}">
                        <img src="{{ route('puzzle.show.image', $image->path) }}" class="w-100 fit-image" height="180">
                    </div>
                @endforeach
            </div>
        </div>
    </div>
    @component('modal.choose-image')
        @slot('title_header')
            Chọn cấp độ
        @endslot
        @slot('content')
            <form action="" method="post">
                @csrf
                <div class="row">
                    <img class="col-5 height-image" src="" alt="Choose image" id="choose-image">
                    <div class="col-7">
                        <h6>Chọn chia chiều ngang</h6>
                        <div class="row" id="width">
                        </div>
                        <h6>Chọn chia chiều dọc</h6>
                        <div class="row" id="height">
                        </div>

                        <div class="row" id="level">
                            <div class="col-6 p-0">
                                <h6>Chọn mức chơi</h6>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="level-image" id="level-1"
                                           value="1" checked>
                                    <label class="form-check-label" for="level-1">
                                        Dễ
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="level-image" id="level-2"
                                           value="2">
                                    <label class="form-check-label" for="level-2">
                                        Trung bình
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="level-image" id="level-3"
                                           value="3">
                                    <label class="form-check-label" for="level-3">
                                        Khó
                                    </label>
                                </div>
                            </div>
                            <div class="col-6 p-0">
                                <h6>Tính thời gian</h6>
                                <div class="form-check">
                                    <input class="form-check-input check-time" type="radio" name="check-time" id="yes"
                                           value="yes" checked>
                                    <label class="form-check-label" for="yes">
                                        Có
                                    </label>
                                </div>
                                <input type="text" id="set-time" class="form-control" placeholder="Tính bằng giây">
                                <div class="form-check">
                                    <input class="form-check-input check-time" type="radio" name="check-time" id="no"
                                           value="no">
                                    <label class="form-check-label" for="no">
                                        Không
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        @endslot
        @slot('title_save')
            OK
        @endslot
        @slot('title_cancel')
            Hủy
        @endslot
    @endcomponent
    @component('modal.notification')
        @slot('title_header')
        @endslot
        @slot('content')
        @endslot
    @endcomponent
@endsection
@section('javascript')
    @parent
    <script>
        _urlUploadImage = "{{ route('ajax.puzzle.upload.image') }}";
    </script>
    @vite('resources/js/toastr.js')
    @vite('resources/js/dropzone.js')
    @vite('resources/js/choose-image.js')
@endsection
