import Header from '@/components/layout/Header';
import BottomTabBar from '@/components/layout/BottomTabBar';
import PageContainer from '@/components/layout/PageContainer';
import StoryRequestForm from '@/components/forms/StoryRequestForm';

export default function RequestPage() {
  return (
    <>
      <Header title="사연 · 신청곡" subtitle="방송국에 보내주세요" />
      <PageContainer className="pt-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="mb-5">
            <h2 className="font-bold text-gray-900">사연 & 신청곡 보내기</h2>
            <p className="text-sm text-gray-500 mt-1">
              여러분의 이야기와 신청곡을 방송국에 보내주세요. 방송에서 소개될 수 있습니다!
            </p>
          </div>
          <StoryRequestForm />
        </div>
      </PageContainer>
      <BottomTabBar />
    </>
  );
}
