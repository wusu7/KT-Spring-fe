import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileCard from "@/features/users/components/ProfileCard";
import { FileText, MessageCircle } from "lucide-react";

// 1. 프로필 카드용 데이터
const myProfile = {
  id: 1,
  name: "나의 닉네임",
  email: "myemail@example.com",
  role: "CHALLENGERS",
  profileImage: "", 
  community_id: 1,
  stats: {
    posts: 5,             
    comments: 12,
    likes: 8,
    participatingChats: 3 
  }
};

export default function MyPage() {
  return (
    <main className="max-w-[1200px] mx-auto pt-8 px-4 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* 왼쪽: 프로필 카드 */}
        <section className="col-span-1">
          <div className="sticky top-24">
            <ProfileCard user={myProfile} currentCommunityId={0} />
          </div>
        </section>

        {/* 오른쪽: 메인 콘텐츠 영역 */}
        <section className="col-span-1 lg:col-span-3">
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900">마이페이지</h1>
            <p className="text-slate-500 mt-2">나의 활동 현황을 한눈에 확인하세요.</p>
          </div>

          {/* 통계 카드 영역 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. 내가 쓴 글 통계 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  내가 쓴 글
                </CardTitle>
                <FileText className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{myProfile.stats.posts}개</div>
                <p className="text-xs text-slate-500 mt-1">
                  커뮤니티에 작성한 게시글 수
                </p>
              </CardContent>
            </Card>

            {/* 2. 참여 중인 채팅 통계 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  참여 중인 채팅
                </CardTitle>
                <MessageCircle className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{myProfile.stats.participatingChats}개</div>
                <p className="text-xs text-slate-500 mt-1">
                  현재 활성화된 오픈채팅방 수
                </p>
              </CardContent>
            </Card>

          </div>
        </section>

      </div>
    </main>
  );
}