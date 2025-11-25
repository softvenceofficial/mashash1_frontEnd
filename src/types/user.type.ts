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
    _id: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
    designation: string;
    email: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    userName: string;
    phoneNumber: string;
    role: TUserRole;
    userStatus: 'Active' | 'Deactivate';
    team?: string;
    teamLead?: string;
    address?: string;
    subArea?: string;
    district?: string;
    state?: string;
    country?: string;
    isBlocked: boolean;
    isDeleted: boolean;
    isPasswordChanged: boolean;
};
