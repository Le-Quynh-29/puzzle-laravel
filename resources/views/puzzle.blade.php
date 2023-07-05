@extends('layout.app')
@section('content')
<div class="card text-center card-puzzle border-box">
    <div class="card-header">
        <div class="row header">
            <div class="col-7">
                <div class="row h-25">
                    <label class="col-12 text-start" style="color: #fff" for="time"><b>Thời gian:</b></label>
                    <div class="col-12 p-right-2">
                        <input type="text" class="form-control text-center h-100" disabled id="time">
                    </div>
                </div>
                <div class="row h-50">
                    <div class="wrapper col-4 p-0 h-100 center-box">
                        <button class="icon previous margin-auto w-50 h-50">
                            <span> <i class="fa-solid fa-arrow-left"></i></span>
                        </button>

                    </div>
                    <div class="wrapper col-4 p-0 h-100 center-box">
                        <button class="icon reset margin-auto w-50 h-50">
                            <span> <i class="fa-solid fa-rotate-right"></i></span>
                        </button>

                    </div>
                    <div class="wrapper col-4 p-0 h-100 center-box">
                        <button class="icon check margin-auto w-50 h-50">
                            <span><i class="fa-solid fa-check"></i></span>
                        </button>
                    </div>
                </div>
                <div class="row h-25">
                    <div class="col-6">
                        <button type="button" class="btn btn-outline-danger w-100" id="exit"><i class="fa-regular fa-circle-xmark"></i></button>
                    </div>
                    <div class="col-6 p-0">
                        <button type="button" class="btn btn-outline-warning w-100" id="pause"><i class="fa-solid fa-play"></i></button>
                    </div>
                </div>
            </div>
            <img class="col-5 height-image" src="" alt="Image choose" id="sample-image">
        </div>
    </div>
    <div class="card-body p-0">
        <canvas id="canvas"></canvas>
    </div>
    @component('modal.notification')
        @slot('title_header')
        @endslot
        @slot('content')
        @endslot
    @endcomponent
    @component('modal.confirm')
        @slot('title_header')
        @endslot
        @slot('content')
        @endslot
        @slot('title_save')
            Có
        @endslot
        @slot('title_cancel')
            Không
        @endslot
    @endcomponent
</div>
@endsection
@section('javascript')
    @parent
@vite('resources/js/toastr.js')
@vite('resources/js/const.js')
@vite('resources/js/piece.js')
@vite('resources/js/game.js')
@endsection
