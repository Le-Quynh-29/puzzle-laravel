<?php

namespace App\Http\Controllers\Ajax;

use App\Repositories\ImageRepository;
use Illuminate\Http\Request;

class PuzzleGameController extends AjaxController
{
    protected $imageRepo;

    function __construct(ImageRepository $imageRepo)
    {
        $this->imageRepo = $imageRepo;
    }

    /**
     * Upload document type local
     *
     * @param  mixed $request
     * @return mixed
     */
    public function uploadImage(Request $request)
    {
        set_time_limit(20);
        $file = $request->file('file');
        $file = $this->imageRepo->addImage($file);
        return $this->responseSuccess($file);
    }
}
