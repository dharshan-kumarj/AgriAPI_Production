<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpeg,png,mp4,mov,avi|max:102400', // 100MB max
            'description' => 'required|string|max:1000',
        ]);

        $file = $request->file('file');
        $fileName = time() . '_' . $file->getClientOriginalName();
        $filePath = $file->storeAs('posts', $fileName, 'public');

        $post = Post::create([
            'user_id' => Auth::id(),
            'file_path' => $filePath,
            'file_type' => $file->getClientMimeType(),
            'description' => $request->description,
        ]);

        return response()->json([
            'message' => 'Post created successfully',
            'post' => $post
        ], 201);
    }

    public function index()
    {
        $posts = Post::with('user')->latest()->get();
        return response()->json($posts);
    }
}