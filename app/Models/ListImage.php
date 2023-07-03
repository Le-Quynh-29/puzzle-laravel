<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ListImage extends Model
{
    use HasFactory;

    protected $table = 'list_images';

    protected $fillable = [
        'name',
        'ext',
        'size',
        'width',
        'height',
        'path',
    ];

    public $timestamps = true;
}
