import Header from '@/components/layout/Header';
import BottomTabBar from '@/components/layout/BottomTabBar';
import PageContainer from '@/components/layout/PageContainer';
import SuggestionForm from '@/components/forms/SuggestionForm';

export default function SuggestionsPage() {
  return (
    <>
      <Header title="건의함" subtitle="방송국에 의견을 보내주세요" />
      <PageContainer className="pt-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="mb-5">
            <h2 className="font-bold text-gray-900">건의하기</h2>
            <p className="text-sm text-gray-500 mt-1">
              방송 품질 향상을 위한 여러분의 소중한 의견을 기다립니다.
            </p>
          </div>
          <SuggestionForm />
        </div>
      </PageContainer>
      <BottomTabBar />
    </>
  );
}
