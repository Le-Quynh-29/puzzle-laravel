<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', [\App\Http\Controllers\StartGameController::class, 'index'])->name('start_game');
Route::group(['prefix' => 'puzzle'], function () {
    Route::get('/', [\App\Http\Controllers\PuzzleGameControler::class, 'index'])->name('puzzle');
    Route::get('/choose-image', [\App\Http\Controllers\PuzzleGameControler::class, 'chooseImage'])->name('puzzle.choose.image');
    Route::get('show-image/{path}', [\App\Http\Controllers\PuzzleGameControler::class, 'show'])->name('puzzle.show.image');
});

