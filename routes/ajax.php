<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('puzzle')->group(function () {
    Route::post('/upload-image', [App\Http\Controllers\Ajax\PuzzleGameController::class, 'uploadImage'])->name('ajax.puzzle.upload.image');
});
