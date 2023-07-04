<?php

namespace App\Repositories;

use App\Models\ListImage;
use App\Repositories\Support\AbstractRepository;
use App\Traits\GameTrait;
use Illuminate\Container\Container as App;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;

class ImageRepository extends AbstractRepository
{
    use GameTrait;
    public function __construct(App $app)
    {
        parent::__construct($app);
    }

    public function model()
    {
        return 'App\Models\ListImage';
    }

    /**
     * Create attachment
     *
     * @param File $file
     * @return mixed
     */
    public function addImage($file)
    {
        $name = $file->getClientOriginalName();
        $checkExist = ListImage::query()->where('name', $name)->exists();
        if ($checkExist) {
            return "Ảnh ".$name." đã tồn tại.";
        }
        $size = $file->getSize() / 1024;
        $ext = $file->getClientOriginalExtension();
        $path = $this->storageUpload($file);
        $sizeImage = getimagesize(storage_path('app/images/' . $path->fileName));
        $width = $sizeImage[0];
        $height = $sizeImage[1];
        $checkSize = $this->checkSizeImageUpload($width, $height);
        if (!$checkSize || $width !== $height) {
            $this->storageDeleteFile('images/' . $path->fileName);
            return "Ảnh ".$name." không thể chia tỉ lệ.";
        }
        $data = [
            'name' => $name,
            'ext' => $ext,
            'size' => $size,
            'width' => $width,
            'height' => $height,
            'path' => $path->path,
        ];

        $attachment = ListImage::create($data);
        return $attachment;
    }

    /**
     * Get content of file.
     * @param string $path
     * @return mixed
     */
    public function responseFile($path)
    {
        $pathDecoded = storage_path('app' . base64_decode($path));
        $file = File::get($pathDecoded);
        $mineType = File::mimeType($pathDecoded);

        $response = Response::make($file, 200);
        $response->header('Content-Type', $mineType);

        return $response;
    }

    /**
     * check size image upload
     *
     * @param integer $width
     * @param integer $height
     * @return mixed
     */
    public function checkSizeImageUpload($width, $height)
    {
        $maxLevel = config('puzzle.puzzle_max_level');
        $level = 3;
        $hasLevel = false;
        do {
            if ($width % $level === 0 && $height % $level === 0) {
                $hasLevel = true;
                break;
            }
            $level += 1;
        } while ($level <= $maxLevel);
        return $hasLevel;
    }
}
