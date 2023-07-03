<?php

namespace App\Repositories\Support;

interface InterfaceRepository
{
    public function all($request, $toArray = true, $with = []);

    public function paginate($perPage = 15, $columns = array('*'));

    public function create(array $data);

    public function update(array $data, $id);

    public function delete($id);

    public function find($id);

    public function findBy($field, $value, $columns = array('*'));
}
