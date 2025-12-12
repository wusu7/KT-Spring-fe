"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LogIn, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/features/auth/AuthContext";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_ENDPOINT = "/api/login";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (error) setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "이메일 또는 비밀번호를 확인해주세요.");
      }

      const data = await response.json(); 
      console.log("로그인 응답 데이터:", data);

      // 토큰과 사용자 정보 분리
      const { accessToken, ...userData } = data;

      if (!accessToken) {
        throw new Error("토큰을 받지 못했습니다.");
      }

      // Context에 로그인 정보 업데이트 (토큰, 유저정보 둘 다 전달)
      login(accessToken, userData);

      alert("로그인되었습니다!");
      router.push("/");

    } catch (err: any) {
      console.error("로그인 오류:", err);
      setError(err.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-[400px] shadow-lg border-slate-200">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">로그인</CardTitle>
        <CardDescription className="text-center">
          이메일과 비밀번호를 입력해 주세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-red-500 text-center">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>

          <div className="text-center text-sm text-slate-500 mt-4">
            계정이 없으신가요?{" "}
            <Link
              href="/signup"
              className="text-slate-900 font-bold hover:underline"
            >
              회원가입
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}