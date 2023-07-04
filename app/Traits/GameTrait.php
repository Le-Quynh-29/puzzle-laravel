<?php

namespace App\Traits;

use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Illuminate\Support\Facades\File;
use Intervention\Image\Facades\Image;

trait GameTrait
{
    /**
     * Upload file image
     * @param File $file
     * @return mixed
     */
    public function storageUpload($file)
    {
        $this->createFolder();
        $parentPath = '/images/';
        $encodeFilename = time() . '_' . sha1($file->getClientOriginalName()) . '.' . $file->getClientOriginalExtension();
        try {
            Storage::disk('local')->putFileAs($parentPath, $file, $encodeFilename);
        } catch (RunTimeException $e) {
            dd($e->getMessage());
        }
        $res = new \stdClass();
        $res->path = base64_encode($parentPath . $encodeFilename);
        $res->fileName = $encodeFilename;
        return $res;
    }

    /**
     * Delete a attachment
     * @param string $fileName
     */
    public function storageDeleteFile($fileName)
    {
        // Check if file exists in storage
        if (!Storage::disk('local')->exists($fileName)) {
            return;
        }
        // Process to delete file
        try {
            Storage::delete($fileName);
        } catch (RunTimeException $e) {
            dd($e->getMessage());
        }
    }

    /**
     * Create a article folder
     */
    private function createFolder()
    {
        try {
            Storage::disk('local')->makeDirectory('/images');
        } catch (RunTimeException $e) {
            dd($e->getMessage());
        }
    }

    /**
     * Upload cover of article
     * @param integer $articleId
     * @param File $cover
     * @return string
     */

    /**
     * Import file into storage
     * @param string $srcFile
     * @param string $desFile
     */
    public function storageImportFile($srcFile, $desFile)
    {
        File::copy($srcFile, $desFile);
        $this->storageSetPermission($desFile);
    }

    /**
     * Setting permission for file in storage
     * @param string $path
     */
    private function storageSetPermission($path)
    {
        chmod($path, 0777);
    }
}
