import {useUserState} from "../../state/User/useUserState.ts";
import {logout} from "../../domain/user/authentication.ts";

export const UserState: React.FC = () => {
    const { refreshUser, user, config } = useUserState();

    if (!user) return null;

  const handleSignout = async () => {
      await logout(config);
      await refreshUser();
  };

  return (
      <>
          <p>You are signed in as {user?.name}</p>
          <button type="button" onClick={handleSignout}>
              Sign Out
          </button>
      </>
  );
};
