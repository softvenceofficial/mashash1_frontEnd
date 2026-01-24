export type TUserRole = 'Admin' | 'Management' | 'Sells' | 'Operation' | 'SQA';

export type TJwtPayload = {
    id: string;
    role: TUserRole;
    email: string;
    avatar: string;
    firstName: string;
    lastName: string;
    memberId: string;
    memberType: 'Leader' | 'Member';
};

export type TCurrentLoginUser = {
    id: string;
    role: TUserRole;
    email: string;
    avatar: string;
    firstName: string;
    lastName: string;
    memberId: string;
    memberType: 'Leader' | 'Member';
    iat: number;
    exp: number;
};

export type TChangePassword = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};

export type TUser = {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    phone_number: string;
    date_of_birth: string | null;
    avatar: string | null;
};
