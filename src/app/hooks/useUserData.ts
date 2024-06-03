import { useAuth } from 'react-oidc-context';

export const useUserData = () => {
    const { user, signoutRedirect } = useAuth();
    const userName = (user?.profile.firstName as string) || '';

    return { userName, signoutRedirect };
};
