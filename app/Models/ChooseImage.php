<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChooseImage extends Model
{
    use HasFactory;

    protected $table = 'choose_images';

    protected $fillable = [
        'user_id',
        'image_id',
        'level_width_id',
        'level_height_id',
    ];
}
