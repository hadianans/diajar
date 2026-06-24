<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Bookmark;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookmarkController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Bookmark::where('student_id', auth()->id())
            ->orderByDesc('created_at');

        if ($request->filled('bookmarkable_type')) {
            $query->where('bookmarkable_type', $request->bookmarkable_type);
        }

        $bookmarks = $query->get();

        // Resolve bookmarked items
        $bookmarks->each(function ($b) {
            $b->item = $b->bookmarkable_type::find($b->bookmarkable_id);
        });

        return $this->success($bookmarks);
    }

    public function toggle(Request $request): JsonResponse
    {
        $request->validate([
            'bookmarkable_id'   => 'required|integer',
            'bookmarkable_type' => 'required|string',
        ]);

        $existing = Bookmark::where('student_id', auth()->id())
            ->where('bookmarkable_id', $request->bookmarkable_id)
            ->where('bookmarkable_type', $request->bookmarkable_type)
            ->first();

        if ($existing) {
            $existing->delete();
            return $this->success(['bookmarked' => false]);
        }

        Bookmark::create([
            'student_id'        => auth()->id(),
            'bookmarkable_id'   => $request->bookmarkable_id,
            'bookmarkable_type' => $request->bookmarkable_type,
        ]);

        return $this->success(['bookmarked' => true]);
    }

    public function destroy(int $id): JsonResponse
    {
        Bookmark::where('student_id', auth()->id())->findOrFail($id)->delete();

        return $this->success(null, 'Bookmark removed');
    }
}
