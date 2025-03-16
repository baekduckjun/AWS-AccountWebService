export const Transition = () => {
  const nextTransition = {
    initial: { opacity: 0, x: 100 },   // 오른쪽에서 시작
    animate: { opacity: 1, x: 0 },     // 화면 중앙에 정착
    exit: { opacity: 0, x: -100 },     // 왼쪽으로 나감
  };
  
  const backTransition = {
    initial: { opacity: 0, x: -100 },  // 왼쪽에서 시작
    animate: { opacity: 1, x: 0 },     // 화면 중앙에 정착
    exit: { opacity: 0, x: 100 },      // 오른쪽으로 나감
  };
};