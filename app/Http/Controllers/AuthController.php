<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    use ApiResponse;

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'login'    => 'required|string',
            'password' => 'required|string',
        ]);

        $login = $request->input('login');
        $field = filter_var($login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        $user = User::where($field, $login)
            ->whereNull('deleted_at')
            ->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return $this->error('Invalid credentials.', 401);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->success([
            'token' => $token,
            'user'  => [
                'id'        => $user->id,
                'full_name' => $user->full_name,
                'role'      => $user->role,
                'picture'   => $user->picture,
            ],
        ], 'Login successful');
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return $this->success(null, 'Logged out');
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->makeHidden('password');

        return $this->success($user);
    }
}
