// import type { TCurrentLoginUser } from '@/types';
// import { jwtDecode } from 'jwt-decode';

// export default function useCurrentUser(): TCurrentLoginUser | null {
//     try {
//         const storedData = localStorage.getItem('persist:userInfo');

//         if (!storedData) return null;

//         const parsedData = JSON.parse(storedData);

//         const loginToken = parsedData?.token;

//         if (!loginToken || typeof loginToken !== 'string') return null;

//         return jwtDecode<TCurrentLoginUser>(loginToken);
//     } catch (error) {
//         console.error('Failed to decode JWT:', error);
//         return null;
//     }
// }

export default function useCurrentUser() {
    try {
        const storedData = localStorage.getItem('persist:userInfo');

        if (!storedData) return null;

        const parsedData = JSON.parse(storedData);
        const user = parsedData.user ? JSON.parse(parsedData.user) : null;
        return user;
    } catch (error) {
        console.error('Failed to decode JWT:', error);
        return null;
    }
}
