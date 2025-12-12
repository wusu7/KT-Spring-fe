"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext"; 

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

function PostFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token } = useAuth(); 
  const initialCategoryId = searchParams.get("category");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    communityId: initialCategoryId ? initialCategoryId : "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, communityId: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. 로그인 여부 확인
    if (!user || !token) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      router.push("/login");
      return;
    }
    
    // 2. 클라이언트 측 유효성 검사
    if (!formData.communityId) {
      alert("게시판을 선택해주세요.");
      return;
    }
    if (!formData.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!formData.content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }
    
    setIsLoading(true);

    // 3. API 명세에 맞는 Payload 구성
    const payload = {
      communityId: Number(formData.communityId),
      title: formData.title,
      content: formData.content,
    };

    // 4. API 호출
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {
        const result = await response.json();
        const newPostId = result.postId || '등록 완료';
        
        alert(`게시글이 성공적으로 등록되었습니다! (ID: ${newPostId})`);
        router.push(`/community?category=${formData.communityId}`);
      } else if (response.status === 401) {
        alert("로그인 정보가 유효하지 않습니다. 다시 로그인 해주세요.");
        router.push("/login");
      } else if (response.status === 400) {
        const errorData = await response.json();
        alert(`입력 오류: ${errorData.message || '입력하신 정보를 확인해주세요.'}`);
      } else {
        throw new Error("서버에서 글 등록에 실패했습니다.");
      }
    } catch (error: any) {
      console.error("게시글 등록 중 오류 발생:", error.message);
      alert(`오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="absolute top-8 left-8 hidden lg:block">
        <button
          onClick={() => router.back()}
          className="flex items-center text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> 뒤로가기
        </button>
      </div>

      <Card className="w-full max-w-[800px] shadow-lg border-slate-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-900">
            글쓰기 ({user ? user.name : '비로그인'})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="community">
                게시판 선택 <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={handleSelectChange}
                defaultValue={formData.communityId}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="게시판을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {communities.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">
                제목 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="제목을 입력하세요"
                value={formData.title}
                onChange={handleChange}
                className="text-lg font-medium h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">
                내용 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                placeholder="자유롭게 내용을 작성해주세요."
                className="min-h-[400px] resize-none text-base leading-relaxed p-4"
                value={formData.content}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="h-12 px-6"
                disabled={isLoading}
              >
                취소
              </Button>
              <Button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 px-8"
                disabled={isLoading}
              >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        등록 중...
                    </>
                ) : (
                    "등록하기"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

export default function PostForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostFormContent />
    </Suspense>
  );
}