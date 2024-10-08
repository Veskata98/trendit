"use client";

import { joinTrend } from "@/actions/trend-actions/joinTrend";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModalStore";
import { TrendWithMembers } from "@/types";
import { useUser } from "@clerk/nextjs";
import { Trend } from "@prisma/client";

export const MyTrendActionButton = ({
    trend,
    currentUserUsername,
}: {
    trend: TrendWithMembers;
    currentUserUsername: string | undefined;
}) => {
    const { onOpen } = useModal();
    const { user } = useUser();
    const isCreator = (trend: Trend) => {
        return trend.creator_name === currentUserUsername;
    };

    if (!user) {
        return <span className="pr-8">-</span>;
    }

    return isCreator(trend) ? (
        <Button
            onClick={() => onOpen("deleteTrend", { trendName: trend.name })}
            className="font-semibold text-primary-800 hover:bg-black/30 dark:text-primary-300"
        >
            Delete
        </Button>
    ) : trend.members.some(
          (member) => member.profile_username === currentUserUsername,
      ) ? (
        <Button
            className="font-semibold text-rose-500 hover:bg-rose-500/20"
            onClick={() => onOpen("leaveTrend", { trendName: trend.name })}
        >
            Leave
        </Button>
    ) : (
        <Button
            className="font-semibold text-emerald-500 hover:bg-emerald-500/20"
            onClick={() => {
                joinTrend(trend.name);
            }}
        >
            Join
        </Button>
    );
};
