<?php

namespace App\Http\Controllers;

use App\Models\ListImage;
use App\Repositories\ImageRepository;
use Illuminate\Http\Request;

class PuzzleGameControler extends Controller
{
    protected $imageRepo;

    public function __construct(ImageRepository $imageRepo)
    {
        $this->imageRepo = $imageRepo;
    }

    public function index()
    {
        return view('puzzle');
    }

    public function chooseImage()
    {
        $listImage = ListImage::all();
        return view('choose-image', compact('listImage'));
    }

    public function show($path)
    {
        if ($path == '') {
            abort(404);
        }
        return $this->imageRepo->responseFile($path);
    }
}
