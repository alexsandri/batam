<?php

namespace App\Docs;

use OpenApi\Attributes as OA;

#[OA\Info(
    title: 'Cafe POS API',
    version: '1.0.0',
    description: 'REST API untuk aplikasi Cafe POS SaaS Multi Tenant'
)]
#[OA\Server(
    url: 'http://127.0.0.1:8000',
    description: 'Local Development Server'
)]
#[OA\SecurityScheme(
    securityScheme: 'bearerAuth',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT'
)]
#[OA\Tag(name: 'Barang', description: 'Manajemen barang')]
#[OA\Tag(name: 'Kategori', description: 'Manajemen kategori barang')]
#[OA\Get(
    path: '/api/user',
    operationId: 'getAuthenticatedUser',
    summary: 'Get the authenticated user',
    security: [['bearerAuth' => []]],
    responses: [
        new OA\Response(response: 200, description: 'Authenticated user'),
        new OA\Response(response: 401, description: 'Unauthenticated'),
    ]
)]
#[OA\Get(
    path: '/api/barangs',
    operationId: 'listBarangs',
    tags: ['Barang'],
    summary: 'List barang',
    responses: [new OA\Response(response: 200, description: 'Paginated barang list')]
)]
#[OA\Post(
    path: '/api/barangs',
    operationId: 'createBarang',
    tags: ['Barang'],
    summary: 'Create a barang',
    responses: [
        new OA\Response(response: 201, description: 'Barang created'),
        new OA\Response(response: 422, description: 'Validation failed'),
    ]
)]
#[OA\Get(
    path: '/api/barangs/{id}',
    operationId: 'getBarang',
    tags: ['Barang'],
    summary: 'Get a barang',
    parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
    responses: [
        new OA\Response(response: 200, description: 'Barang details'),
        new OA\Response(response: 404, description: 'Barang not found'),
    ]
)]
#[OA\Put(
    path: '/api/barangs/{id}',
    operationId: 'updateBarang',
    tags: ['Barang'],
    summary: 'Update a barang',
    parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
    responses: [
        new OA\Response(response: 200, description: 'Barang updated'),
        new OA\Response(response: 404, description: 'Barang not found'),
        new OA\Response(response: 422, description: 'Validation failed'),
    ]
)]
#[OA\Patch(
    path: '/api/barangs/{id}',
    operationId: 'patchBarang',
    tags: ['Barang'],
    summary: 'Update a barang',
    parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
    responses: [
        new OA\Response(response: 200, description: 'Barang updated'),
        new OA\Response(response: 404, description: 'Barang not found'),
        new OA\Response(response: 422, description: 'Validation failed'),
    ]
)]
#[OA\Delete(
    path: '/api/barangs/{id}',
    operationId: 'deleteBarang',
    tags: ['Barang'],
    summary: 'Delete a barang',
    parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
    responses: [
        new OA\Response(response: 200, description: 'Barang deleted'),
        new OA\Response(response: 404, description: 'Barang not found'),
    ]
)]
#[OA\Get(
    path: '/api/kategoris',
    operationId: 'listKategoris',
    tags: ['Kategori'],
    summary: 'List kategori',
    parameters: [
        new OA\Parameter(
            name: 'search',
            in: 'query',
            description: 'Cari berdasarkan nama kategori',
            schema: new OA\Schema(type: 'string')
        ),
        new OA\Parameter(
            name: 'page',
            in: 'query',
            description: 'Nomor halaman',
            schema: new OA\Schema(type: 'integer', minimum: 1)
        ),
    ],
    responses: [new OA\Response(response: 200, description: 'Paginated kategori list')]
)]
#[OA\Post(
    path: '/api/kategoris',
    operationId: 'createKategori',
    tags: ['Kategori'],
    summary: 'Create a kategori',
    responses: [
        new OA\Response(response: 201, description: 'Kategori created'),
        new OA\Response(response: 422, description: 'Validation failed'),
    ]
)]
#[OA\Get(
    path: '/api/kategoris/{id}',
    operationId: 'getKategori',
    tags: ['Kategori'],
    summary: 'Get a kategori',
    parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
    responses: [
        new OA\Response(response: 200, description: 'Kategori details'),
        new OA\Response(response: 404, description: 'Kategori not found'),
    ]
)]
#[OA\Put(
    path: '/api/kategoris/{id}',
    operationId: 'updateKategori',
    tags: ['Kategori'],
    summary: 'Update a kategori',
    parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
    responses: [
        new OA\Response(response: 200, description: 'Kategori updated'),
        new OA\Response(response: 404, description: 'Kategori not found'),
        new OA\Response(response: 422, description: 'Validation failed'),
    ]
)]
#[OA\Patch(
    path: '/api/kategoris/{id}',
    operationId: 'patchKategori',
    tags: ['Kategori'],
    summary: 'Update a kategori',
    parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
    responses: [
        new OA\Response(response: 200, description: 'Kategori updated'),
        new OA\Response(response: 404, description: 'Kategori not found'),
        new OA\Response(response: 422, description: 'Validation failed'),
    ]
)]
#[OA\Delete(
    path: '/api/kategoris/{id}',
    operationId: 'deleteKategori',
    tags: ['Kategori'],
    summary: 'Delete a kategori',
    parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
    responses: [
        new OA\Response(response: 200, description: 'Kategori deleted'),
        new OA\Response(response: 404, description: 'Kategori not found'),
    ]
)]
class Swagger
{
}
