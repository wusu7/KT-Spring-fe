"use client";

import { useState, useRef } from "react";
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
import { UserPlus, Loader2, Camera, User } from "lucide-react";
import Link from "next/link";

const communities = [
  { id: 1, name: "풀스택" },
  { id: 2, name: "프론트엔드" },
  { id: 3, name: "백엔드" },
  { id: 4, name: "생성형 AI" },
  { id: 5, name: "사이버 보안" },
  { id: 6, name: "클라우드 인프라" },
  { id: 7, name: "클라우드 네이티브" },
  { id: 8, name: "프로덕트 디자인" },
  { id: 9, name: "프로덕트 매니지먼트" },
];

export default function SignupForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    communityId: "",
    agreed: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("이미지 크기는 5MB 이하여야 합니다.");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드 가능합니다.");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!formData.communityId) {
      alert("참여 중인 과정을 선택해주세요.");
      return;
    }
    if (!formData.agreed) {
      alert("개인정보 수집 및 이용에 동의해야 합니다.");
      return;
    }

    setIsLoading(true);

    // FormData 객체 생성
    const signupFormData = new FormData();
    
    // 회원가입 정보를 Blob(JSON)으로 변환하여 추가
    const signupData = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      community_id: Number(formData.communityId),
      role: "CHALLENGERS",
    };
    signupFormData.append(
      "signupData",
      new Blob([JSON.stringify(signupData)], { type: "application/json" })
    );

    // 프로필 이미지가 있다면 추가
    if (avatarFile) {
      signupFormData.append("avatarFile", avatarFile);
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        // Content-Type 헤더는 제거 (브라우저가 자동 설정)
        body: signupFormData,
      });

      if (response.ok) {
        alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
        router.push("/login");
      } else {
        const errorText = await response.text();
        alert(`회원가입 실패: ${errorText || "서버 오류가 발생했습니다."}`);
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("서버와 연결할 수 없습니다. 백엔드가 켜져있는지 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-[600px] shadow-lg border-slate-200 my-8">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          회원가입
        </CardTitle>
        <CardDescription className="text-center">
          TechUp 챌린저 허브의 멤버가 되어보세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-6">
          
          {/* 프로필 이미지 (선택) */}
          <div className="flex flex-col items-center space-y-3">
            <Label className="text-base">프로필 이미지 (선택)</Label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 hover:border-slate-400 cursor-pointer transition-colors flex items-center justify-center overflow-hidden group"
            >
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="프로필 미리보기" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-slate-300" />
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <p className="text-xs text-slate-400">클릭하여 이미지 선택 (최대 5MB)</p>
          </div>

          {/* 1. 이메일 */}
          <div className="space-y-2">
            <Label htmlFor="email">
              이메일 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          {/* 2. 비밀번호 */}
          <div className="space-y-2">
            <Label htmlFor="password">
              비밀번호 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          {/* 3. 비밀번호 확인 */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              비밀번호 확인 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          {/* 4. 이름 (닉네임) */}
          <div className="space-y-2">
            <Label htmlFor="name">
              이름 (닉네임) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="활동할 닉네임을 입력하세요"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          {/* 5. 참여 중인 과정 */}
          <div className="space-y-3">
            <Label className="text-base">
              참여 중인 과정 <span className="text-red-500">*</span>
            </Label>
            <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
              <div className="grid grid-cols-3 gap-x-2 gap-y-4">
                {communities.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center space-x-2 cursor-pointer hover:opacity-80"
                  >
                    <input
                      type="radio"
                      name="communityId"
                      value={c.id}
                      checked={formData.communityId === String(c.id)}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-4 h-4 accent-slate-900 cursor-pointer shrink-0"
                    />
                    <span className="text-sm font-medium text-slate-700 truncate">
                      {c.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 6. 개인정보 동의 */}
          <div className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg bg-slate-50">
            <input
              id="terms"
              name="agreed"
              type="checkbox"
              checked={formData.agreed}
              onChange={handleChange}
              disabled={isLoading}
              className="w-4 h-4 accent-slate-900 cursor-pointer shrink-0"
            />
            <label
              htmlFor="terms"
              className="text-sm text-slate-600 leading-snug cursor-pointer select-none"
            >
              <span className="font-bold text-slate-900">
                개인 정보 수집 및 이용에 동의합니다.
              </span>{" "}
              <span className="text-red-500">*</span>
              <br />
              <span className="text-xs text-slate-500 block mt-1">
                수집된 정보는 서비스 이용을 위해서만 사용되며, 회원 탈퇴 시 즉시
                파기됩니다.
              </span>
            </label>
          </div>

          {/* 가입 버튼 */}
          <Button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 text-md mt-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                가입 중...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" /> 가입 완료하기
              </>
            )}
          </Button>

          <div className="text-center text-sm text-slate-500 mt-4">
            이미 계정이 있으신가요?{" "}
            <Link
              href="/login"
              className="text-slate-900 font-bold hover:underline"
            >
              로그인
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}