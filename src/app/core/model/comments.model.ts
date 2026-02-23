export interface Comments {
    id: string;
    comments: string;
    authorRole: string;
    authorName: string;
    createdAt: Date;
    updatedAt?: Date;
    memberId?: string;
    isDeleted?: boolean;
}