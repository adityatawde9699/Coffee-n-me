import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Eye, ThumbsUp, FileText, MessageSquare, LucideIcon } from 'lucide-react';

interface DraftPost {
    id: string;
    title: string;
    updated_at: string;
}

interface PendingComment {
    id: number;
    author_name: string;
    content: string;
    created_at: string;
}

interface DashboardStats {
    stats: {
        total_posts: number;
        total_views: number;
        total_likes: number;
    };
    recent_drafts: DraftPost[];
    pending_comments: PendingComment[];
}

export function Dashboard() {
    const [data, setData] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/api/admin/dashboard/'); // Note: Ensure this matches backend URL
                setData(response.data);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) return <div>Loading dashboard...</div>;
    if (!data) return <div>Failed to load dashboard data.</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-[#3C2415]">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={FileText}
                    label="Total Posts"
                    value={data.stats.total_posts}
                    color="bg-blue-500"
                />
                <StatCard
                    icon={Eye}
                    label="Total Views"
                    value={data.stats.total_views}
                    color="bg-green-500"
                />
                <StatCard
                    icon={ThumbsUp}
                    label="Total Likes"
                    value={data.stats.total_likes}
                    color="bg-purple-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Drafts */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <PenSquare className="h-5 w-5 text-gray-500" />
                        Recent Drafts
                    </h2>
                    <div className="space-y-4">
                        {data.recent_drafts.length === 0 ? (
                            <p className="text-gray-500">No drafts found.</p>
                        ) : (
                            data.recent_drafts.map((draft) => (
                                <div key={draft.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium text-gray-700">{draft.title}</span>
                                    <span className="text-sm text-gray-500">
                                        {new Date(draft.updated_at).toLocaleDateString()}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Pending Comments */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-gray-500" />
                        Pending Comments
                    </h2>
                    <div className="space-y-4">
                        {data.pending_comments.length === 0 ? (
                            <p className="text-gray-500">No pending comments.</p>
                        ) : (
                            data.pending_comments.map((comment) => (
                                <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-medium text-sm">{comment.author_name}</span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(comment.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm truncate">{comment.content}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: number;
    color: string;
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
                <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
}

import { PenSquare } from 'lucide-react';
