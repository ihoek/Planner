import { useUserStore } from "../../store/userStore";

const UserInfo = () => {
  const { user, isAuthenticated, logout, login, isLoading, error } =
    useUserStore();

  const handleLogin = async () => {
    // 테스트용 로그인
    await login("test@example.com", "password");
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>에러: {error}</div>;
  }

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}
    >
      <h3>사용자 정보</h3>
      {isAuthenticated && user ? (
        <div>
          <p>이름: {user.name}</p>
          <p>이메일: {user.email}</p>
          <p>ID: {user.id}</p>
          <button onClick={logout}>로그아웃</button>
        </div>
      ) : (
        <div>
          <p>로그인이 필요합니다.</p>
          <button onClick={handleLogin}>테스트 로그인</button>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
