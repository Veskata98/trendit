'use client';

import { Button } from '@/components/ui/button';
import { joinTrend } from '@/actions/trend-actions/joinTrend';
import { TrendWithPostsAndMembers, UserStatus } from '@/types';
import { leaveTrend } from '@/actions/trend-actions/leaveTrend';
import { CreatePostButton } from '@/components/trends/trend-main/CreatePostButton';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { TrendName } from './TrendName';

export const TrendHeader = ({ trend, userStatus }: { trend: TrendWithPostsAndMembers; userStatus: UserStatus }) => {
    // const searchParams = useSearchParams();

    return (
        <div className="w-full flex flex-col px-2 space-y-6">
            <div className="flex items-center justify-center gap-2">
                <Avatar className="w-16 h-16">
                    <AvatarImage src={trend.image_url} alt="trend_image" />
                </Avatar>
                <TrendName trendName={trend.name} />
            </div>
            <div className="flex justify-between items-center border-b-[1px] border-zinc-300/50 dark:border-zinc-700/50 pb-2">
                <div>Sort type</div>
                <div className="flex gap-1 items-center">
                    {(userStatus === 'owner' || userStatus === 'member') && <CreatePostButton trendName={trend.name} />}

                    {userStatus === 'member' && (
                        <Button
                            className="font-semibold text-rose-500 hover:bg-rose-500/20"
                            onClick={() => {
                                leaveTrend(trend.name);
                            }}
                        >
                            Leave
                        </Button>
                    )}

                    {userStatus === 'nonMember' && (
                        <Button
                            className="font-semibold text-emerald-500 hover:bg-emerald-500/20"
                            onClick={() => {
                                joinTrend(trend.name);
                            }}
                        >
                            Join
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
