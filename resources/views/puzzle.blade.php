@extends('layout.app')
@section('content')
<div class="card text-center card-puzzle border-box">
    <div class="card-header">
        <div class="row">
            <img class="col-5 p-left-2" src="" alt="Image choose" id="sample-image">
            <div class="col-7">
                <div class="row">
                    <label class="col-4 text-start" style="color: #fff" for="time"><b>Thời gian:</b></label>
                    <div class="col-8 p-right-2">
                        <input type="text" class="form-control text-center h-100" disabled id="time">
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="wrapper col-6">
                        <button class="icon reset margin-auto">
                            <span> <i class="fa-solid fa-rotate-right"></i></span>
                        </button>

                    </div>
                    <div class="wrapper col-6">
                        <button class="icon check margin-auto">
                            <span><i class="fa-solid fa-check"></i></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="card-body p-0">
        <canvas id="canvas"></canvas>
    </div>
</div>
@endsection
@section('javascript')
    @parent
@vite('resources/js/const.js')
@vite('resources/js/piece.js')
@vite('resources/js/game.js')
@endsection
