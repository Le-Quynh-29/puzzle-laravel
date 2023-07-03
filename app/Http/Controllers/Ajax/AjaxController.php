<?php

namespace App\Http\Controllers\Ajax;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class AjaxController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function responseSuccess($data, $httpStatusCode = 200)
    {
        return response()->json(
            [
                'data' => $data,
                'status' => $httpStatusCode
            ],
            $httpStatusCode
        );
    }

    public function responseError($error, $httpStatusCode = 400)
    {
        return response()->json(
            [
                'error' => $error,
                'status' => $httpStatusCode
            ],
            $httpStatusCode
        );
    }
}
