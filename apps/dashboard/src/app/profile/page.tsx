'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useUserData } from '@repo/database';
import { Sidebar } from '@/components/SideBar';
import { UserCircle, Settings, Bell, HelpCircle, House, Moon, Volume2, Globe, Key } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";

export default function BasicProfilePage() {
    const { user, token, loading, logout } = useUserData();
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeSection, setActiveSection] = useState('profile');

    const handleHomeClick = () => {
        // Redirect to landing page (port 3000)
        window.location.href = 'http://localhost:3000';
    };

    const sidebarItems = [
        { 
            icon: House, 
            label: 'Главная страница', 
            onClick: handleHomeClick // Add onClick handler
        },
        { icon: UserCircle, label: 'Личный кабинет', href: '#profile' },
        { icon: Settings, label: 'Настройки', href: '#settings' },
        { icon: Bell, label: 'Заказы', href: '#orders' },
        { icon: HelpCircle, label: 'Помогите', href: '#help' },
    ];

    const handleSidebarItemClick = (sectionId: string) => {
        if (sectionId === 'home') {
            handleHomeClick();
        } else {
            setActiveSection(sectionId);
        }
    };

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth');
        }
        if (user && user.user_type !== 'user') {
            router.push('/worker-profile');
        }
    }, [user, loading, router]);

    if (loading) {
        return <div className="flex items-center justify-center h-screen text-[#00358E]">Loading...</div>;
    }

    if (!user || !token || user.user_type !== 'user') {
        return null;
    }

    const orders = [
        { id: '1', date: '2024-10-25', status: 'Доставлено', total: '56.999' },
        { id: '2', date: '2024-10-24', status: 'В пути', total: '35.499' },
        { id: '3', date: '2024-10-23', status: 'Обработка', total: '18.999' },
        { id: '4', date: '2024-10-22', status: 'Доставлено', total: '22.199' },
        { id: '5', date: '2024-10-21', status: 'Отменено', total: '41.599' },
    ];

    return (
        <div className="flex min-h-screen bg-[#F5F5F7]">
            <Sidebar
                items={sidebarItems}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                onItemClick={handleSidebarItemClick}
            />

            <main className="flex-1 p-8">
                <div className="max-w-3xl mx-auto">
                    {activeSection === 'profile' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl font-semibold text-gray-700">Профиль</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-[#86868B]">Имя пользователя</Label>
                                    <p className="mt-1 text-lg text-gray-700">{user.fullName}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-[#86868B]">Email</Label>
                                    <p className="mt-1 text-lg text-gray-700">{user.email}</p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    onClick={logout}
                                    className="bg-[#D1350F] text-white py-2 px-4 rounded-lg hover:bg-red-400 transition-colors"
                                >
                                    Выйти
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {/* Rest of your sections... */}
                </div>
            </main>
        </div>
    );
}